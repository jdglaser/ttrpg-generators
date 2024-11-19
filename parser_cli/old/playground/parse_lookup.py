import json
import re
from itertools import batched
from pathlib import Path

import pyperclip

data = Path("input/themes.txt").read_text()
lookup = Path("input/theme_map.txt").read_text()

char_replacements = [("\u2018", "'"), ("\u2019", "'"), ("\u201c", '"'), ("\u201d", '"'), ("\n", " ")]

results = {}
for title, description in batched([r for r in re.split(r"([a-zA-Z0-9-_]+): ", data) if r != ""], 2):
    for c, r in char_replacements:
        description = description.replace(c, r)

    results[title] = {"title": title, "description": description.strip()}


char_replacements = [("\u2018", "'"), ("\u2019", "'"), ("\u201c", '"'), ("\u201d", '"')]

lookup = [r for r in lookup.split("\n") if r != ""]
final = {}
for row in lookup:
    if row == "":
        continue

    for c, r in char_replacements:
        row = row.replace(c, r)

    row = re.sub(r"^\d+ ", "", row).strip()
    title, tag = row.split(", ")
    final[title] = {"title": title, "tag": tag}

new_results = []
for key, value in final.items():
    new_results.append(value | {"description": results[key]["description"]})

string_result = json.dumps(new_results, indent=2)
print(string_result)
pyperclip.copy(string_result)
