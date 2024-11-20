import json
from collections import OrderedDict
from pathlib import Path
from typing import Literal

import click
import pyperclip

from parser_cli.models import Table
from parser_cli.table_parser import parse_column, parse_simple, parse_tags, replace_chars
from parser_cli.utils import to_id


@click.group()
def cli(): ...


@cli.command()
@click.option(
    "--input-path",
    "-i",
    type=click.Path(
        exists=True,
        file_okay=False,
        dir_okay=True,
        readable=True,
        path_type=Path,
    ),
    default=Path("parser_cli/input"),
)
@click.option(
    "--output-path",
    "-o",
    type=click.Path(
        file_okay=False,
        dir_okay=True,
        writable=True,
        path_type=Path,
    ),
    default=Path("parser_cli/output"),
)
@click.option("--mapping", "-m", is_flag=True, default=False)
@click.option("--has-titles", "-h", is_flag=True, default=False)
@click.option("--type", "-t", type=click.Choice(["simple", "column", "tag"]), default="simple")
def generate_table(
    input_path: Path, output_path: Path, mapping: bool, has_titles: bool, type: Literal["simple", "column", "tag"]
):
    table_str = (input_path / "input.txt").read_text().strip()
    mapping_str = None
    if mapping:
        mapping_str = (input_path / "mapping.txt").read_text().strip()
        mapping_str = replace_chars(mapping_str)
    match type:
        case "simple":
            all_tables = {}
            for table in [r.strip() for r in table_str.split("---") if r not in ["", "---"]]:
                table = replace_chars(table)
                if table.split("\n")[0].startswith("["):
                    parsed_tables = parse_column(table)
                    for parsed_table in parsed_tables:
                        key = to_id(parsed_table.title)
                        all_tables[key] = parsed_table.model_dump(by_alias=True, exclude_none=True)
                else:
                    parsed_table = parse_simple(table, mapping=mapping_str, has_titles=has_titles)
                    key = to_id(parsed_table.title)
                    all_tables[key] = parsed_table.model_dump(by_alias=True, exclude_none=True)
            json_str = json.dumps(all_tables, indent=2)
            print(json_str[1:-2])
            pyperclip.copy(json_str[1:-2])


@cli.command()
@click.option(
    "--input-path",
    "-i",
    type=click.Path(
        exists=True,
        file_okay=False,
        dir_okay=True,
        readable=True,
        path_type=Path,
    ),
    default=Path("parser_cli/input"),
)
@click.option(
    "--output-path",
    "-o",
    type=click.Path(
        file_okay=False,
        dir_okay=True,
        writable=True,
        path_type=Path,
    ),
    default=Path("parser_cli/output"),
)
def generate_tags(input_path: Path, output_path: Path):
    tags = replace_chars((input_path / "tags.txt").read_text().strip())
    tag_headers = replace_chars((input_path / "tag_headers.txt").read_text().strip()).split("\n")
    tag_table = parse_tags(tags, tag_headers)
    model_json = tag_table.model_dump(by_alias=True, exclude_none=True)
    json_str = json.dumps(model_json, indent=2)
    print(json_str[1:-2])
    pyperclip.copy(json_str[1:-2])
    with open(output_path / f"{tag_table.title}.json", "w") as fp:
        json.dump(model_json, fp, indent=2)


@cli.command()
def clean_json():
    data = json.loads(Path("src/data/table_ref.json").read_text(), object_pairs_hook=OrderedDict)

    new_final = {}
    for key, tables in data.items():
        new_tables = {}
        for inner_key, table in tables.items():
            new_table = {"dice": table["dice"], "title": table["title"]}
            new_rows = []
            for row in table["table"]:
                new_row = {}
                if row["type"] == "range":
                    new_row["number"] = {"type": "range", "minValue": row["minValue"], "maxValue": row["maxValue"]}
                else:
                    new_row["number"] = {"type": "single", "value": row["value"]}
                if "title" in row["result"]:
                    row["result"].pop("title")

                new_row["result"] = row["result"]
                new_rows.append(new_row)
            new_table["rows"] = new_rows

            table_model = Table.model_validate(new_table)
            new_tables[inner_key] = table_model.model_dump(by_alias=True, exclude_none=True)
        new_final[key] = new_tables
    # with open(Path("src/data/table_ref_new.json"), "w") as fp:
    #     json.dump(new_final, fp, indent=2)


if __name__ == "__main__":
    cli()
