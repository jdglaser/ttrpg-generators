import json
import re
from itertools import batched
from typing import Optional

from parser_cli.models import Dice, Table, TableRow, TableRowSingleNumber

CHAR_REPLACEMENTS = char_replacements = [
    ("\u2018", "'"),
    ("\u2019", "'"),
    ("\u201c", '"'),
    ("\u201d", '"'),
    ("\u2013", "-"),
]


def replace_chars(string: str):
    for c, r in char_replacements:
        string = string.replace(c, r)
    return string


def parse_rows(rows: list[str], has_titles: bool = False, mapping: Optional[str] = None):
    parsed_rows: list[TableRow] = []
    for row in rows:
        if row == "":
            continue

        split_char = None
        if has_titles:
            split_char = next(c for c in row if c in [".", ","])
            first, second = row.split(split_char, 1)
            matches = re.match(r"^(?P<result_match>\d+(-\d+)?) ((?P<result_title>.+))", first)
            if not matches:
                raise Exception(f"Problem parsing table row {row}")
            match_dict = matches.groupdict() | {"result": second.strip()}
        else:
            matches = re.match(r"^(?P<result_match>\d+(-\d+)?) (?P<result>.+)$", row)
            if not matches:
                raise Exception(f"Problem parsing table row {row}")
            match_dict = matches.groupdict()

        result_match = match_dict["result_match"]
        result_title = match_dict.get("result_title")
        split_char = split_char if split_char else "."
        result = (f"{result_title}{split_char} " if result_title else "") + match_dict["result"]

        description = None
        if mapping:
            lookup_key = result_title if result_title else result
            parsed_mapping = _handle_mapping(mapping)
            description = parsed_mapping[lookup_key]

        result = (
            json.loads(result)
            if result.startswith("{")
            else {"type": "text", "longDescription": description, "value": result}
        )
        if "-" in result_match:
            min_val, max_val = result_match.split("-")
            max_val = 100 if max_val == "00" else max_val
            min_val = 100 if min_val == "00" else min_val
            table_row = TableRow.model_validate(
                {
                    "number": {
                        "type": "range",
                        "minValue": min_val,
                        "maxValue": max_val,
                    },
                    "result": result,
                }
            )
        else:
            table_row = TableRow.model_validate(
                {
                    "number": {
                        "type": "single",
                        "value": result_match,
                    },
                    "result": result,
                }
            )

        parsed_rows.append(table_row)
    return parsed_rows


def _handle_mapping(mapping: str):
    items = {}
    current_key = None
    for row in mapping.split("\n"):
        row_str = row.strip()
        if row_str == "":
            continue
        header_match = re.match(r"^(?P<header>[a-zA-Z ]+): (?P<text>.+)$", row_str)
        if header_match:
            groups = header_match.groupdict()
            header = groups["header"]
            items[header] = groups["text"]
            current_key = header

        if current_key and not header_match:
            items[current_key] += f" {row_str}"

    return items


def parse_simple(table: str, mapping: Optional[str] = None, has_titles: bool = False, tag: bool = False):
    rows = [r for r in table.split("\n") if r != ""]
    title_row = rows[0]
    parsed_title = re.match(r"^(?P<num_dice>\d)?d(?P<dice_sides>\d+) (?P<title>.+)$", title_row)
    if not parsed_title:
        raise Exception(f"Problem parsing title row {title_row}")

    parsed_title_groups = parsed_title.groupdict()
    title = parsed_title_groups["title"]
    dice_sides = parsed_title_groups["dice_sides"]
    dice = Dice.model_validate(
        {"diceSides": 100 if dice_sides == "00" else dice_sides, "numDice": parsed_title_groups["num_dice"]}
    )

    cleaned_rows = []
    current_idx = 0
    for row in rows[1:]:
        if row[0].isdigit():
            cleaned_rows.append(row)
            current_idx += 1
        else:
            cleaned_rows[current_idx - 1] += f" {row}"

    parsed_rows = parse_rows(cleaned_rows, has_titles, mapping)
    parsed_rows = sorted(
        parsed_rows, key=lambda r: r.number.value if isinstance(r.number, TableRowSingleNumber) else r.number.min_value
    )
    parsed_table = Table(dice=dice, title=title, rows=parsed_rows)
    return parsed_table


def parse_column(table: str):
    rows = [r for r in table.split("\n") if r != ""]
    header_row = rows[0]
    headers = json.loads(header_row)
    parsed_dice = re.match(r"(?P<num_dice>\d)?d(?P<dice_sides>\d+)", headers[0])
    if not parsed_dice:
        raise Exception(f"Problem parsing dice for {headers[0]}")
    dice_sides = parsed_dice["dice_sides"]
    dice = Dice.model_validate(
        {"diceSides": 100 if dice_sides == "00" else dice_sides, "numDice": parsed_dice["num_dice"]}
    )

    cleaned_rows = []
    current_idx = 0
    for row in rows[1:]:
        if row[0].isdigit():
            cleaned_rows.append(row)
            current_idx += 1
        else:
            cleaned_rows[current_idx - 1] += f" {row}"

    columns = [[] for _ in headers[1:]]
    for row in cleaned_rows:
        row_match = re.match(r"(\d+) ", row)
        if not row_match:
            raise Exception(f"Problem parsing number from row {row}")
        value = row_match.groups()[0]
        row = re.sub(r"(\d+) ", "", row, 1)
        cols_split = re.split(r"\|", row, len(columns))
        for idx, v in enumerate(cols_split):
            columns[idx].append(f"{value} {v}")

    parsed_tables: list[Table] = []
    for idx, column in enumerate(columns):
        parsed_rows = parse_rows(column)
        parsed_rows = sorted(
            parsed_rows,
            key=lambda r: r.number.value if isinstance(r.number, TableRowSingleNumber) else r.number.min_value,
        )
        parsed_table = Table(dice=dice, title=headers[1:][idx], rows=parsed_rows)
        parsed_tables.append(parsed_table)
    return parsed_tables
