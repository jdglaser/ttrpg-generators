import json
import re
from itertools import batched, pairwise
from pathlib import Path

import pyperclip

data = Path("input/location_tags.txt").read_text()
mapping = Path("input/location_tag_headers.txt").read_text()

# results = []
# for title, description in batched([r for r in re.split(r"([a-zA-Z0-9-_]+): ", data) if r != ""], 2):
#     results.append(f"  <b>{title} - </b>{description.replace('\n', ' ')}")

# results = [i.strip() for i in data.split("\n") if i != ""]
# print(len(results))

char_replacements = [("\u2018", "'"), ("\u2019", "'"), ("\u201c", '"'), ("\u201d", '"')]  # , ("\u2022", "•")]

items = []
headers = mapping.split("\n")
# results = re.split(r"(P [a-zA-Z]+)", data)
key = "description"
for line in data.split("\n"):
    if "\u2022" in line:
        continue
    for c, r in char_replacements:
        line = line.replace(c, r)
    if line.strip() in headers:
        items.append(
            {
                "header": line,
                "description": [],
                "enemies": [],
                "friends": [],
                "complications": [],
                "things": [],
                "places": [],
            }
        )
        key = "description"
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
        if k != "header":
            i[k] = " ".join(i[k])

# print(items)

with open("output/location_tags.json", "w") as fp:
    json.dump(items, fp, indent=2)

# lines = []
# for item in items:
#     lines.append(
#         f"<b>{item['header']}</b> - {item['description']}<ul>"
#         f"<li><b>Enemies</b>: {item['E']}</li>"
#         f"<li><b>Friends</b>: {item['F']}</li>"
#         f"<li><b>Complications</b>: {item['C']}</li>"
#         f"<li><b>Things</b>: {item['T']}</li>"
#         f"<li><b>Places</b>: {item['P']}</li>"
#         "</ul>"
#     )

# print("\n".join(lines))
# pyperclip.copy("\n".join(lines))
