import json
import re
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


def parse_rows(
    rows: list[str],
    has_titles: bool = False,
    mapping: Optional[dict[str, str]] = None,
    tags: Optional[dict[str, dict[str, str]]] = None,
):
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
            description = mapping[lookup_key]

        tag = None
        if tags:
            lookup_key = result_title if result_title else result
            tag = tags[lookup_key]

        if tag:
            result = tag
        else:
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
    items: dict[str, str] = {}
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

    mapping_dict = None
    if mapping:
        mapping_dict = _handle_mapping(mapping)
    parsed_rows = parse_rows(cleaned_rows, has_titles, mapping_dict)
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


def parse_tags(tags: str, tag_rows: list[str]):
    items = []

    title_row = tag_rows[0].strip()
    parsed_title = re.match(r"^(?P<num_dice>\d)?d(?P<dice_sides>\d+) (?P<title>.+)$", title_row)
    if not parsed_title:
        raise Exception(f"Problem parsing title row '{title_row}'")

    parsed_title_groups = parsed_title.groupdict()
    title = parsed_title_groups["title"]
    dice_sides = parsed_title_groups["dice_sides"]
    dice = Dice.model_validate(
        {"diceSides": 100 if dice_sides == "00" else dice_sides, "numDice": parsed_title_groups["num_dice"]}
    )

    tag_headers = [re.sub(r"(\d+ )|(\d+-\d+ )", "", i) for i in tag_rows[1:]]

    key = "longDescription"
    for line in tags.split("\n"):
        if "\u2022" in line:
            continue

        if line.strip() in tag_headers:
            items.append(
                {
                    "type": "tag",
                    "name": line,
                    "longDescription": [],
                    "enemies": [],
                    "friends": [],
                    "complications": [],
                    "things": [],
                    "places": [],
                }
            )
            key = "longDescription"
        else:
            current_item = items[-1]
            if line.strip().startswith("E "):
                key = "enemies"
                line = line.replace("E ", "")
            if line.strip().startswith("F "):
                key = "friends"
                line = line.replace("F ", "")
            if line.strip().startswith("C "):
                key = "complications"
                line = line.replace("C ", "")
            if line.strip().startswith("T "):
                key = "things"
                line = line.replace("T ", "")
            if line.strip().startswith("P "):
                key = "places"
                line = line.replace("P ", "")

            current_item[key].append(line.replace("\n", " "))

    for i in items:
        for k in i:
            if k not in ["name", "type"]:
                i[k] = " ".join(i[k])

    tags_by_name = {i["name"]: i for i in items}
    rows = sorted(
        parse_rows(tag_rows[1:], tags=tags_by_name),
        key=lambda r: r.number.value if isinstance(r.number, TableRowSingleNumber) else r.number.min_value,
    )
    return Table(dice=dice, title=title, rows=rows)
