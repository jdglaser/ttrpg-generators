import json
from pathlib import Path
from typing import Literal

import click
import pyperclip

from parser_cli.table_parser import parse_simple
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
    match type:
        case "simple":
            all_tables = {}
            for table in [r.strip() for r in table_str.split("---") if r not in ["", "---"]]:
                parsed_table = parse_simple(table, mapping=mapping_str, has_titles=has_titles)
                key = to_id(parsed_table.title)
                all_tables[key] = parsed_table.model_dump(by_alias=True)
            json_str = json.dumps(all_tables, indent=2)
            print(json_str[1:-2])
            pyperclip.copy(json_str[1:-2])


if __name__ == "__main__":
    cli()
