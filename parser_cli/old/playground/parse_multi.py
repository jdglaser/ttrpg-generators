import json
import re
from itertools import batched

import pyperclip

headers = ["Hair Color", "Hair Texture"]
data = """
1 Night-black Very tightly-curled
2 Dark browns Dense and curled
3 Lighter browns Slightly wavy
4 Red shades Stiff and straight
5 Blonds Thick and wavy
6 White or white-blond Thin and fine
7 An unusual palette Thick and flowing
8 They lack hair Scant and delicate
"""

char_replacements = [("\u2018", "'"), ("\u2019", "'"), ("\u201c", '"'), ("\u201d", '"')]

tables = [[] for _ in headers]
for row in data.split("\n"):
    if row == "":
        continue

    for c, r in char_replacements:
        row = row.replace(c, r)

    row = re.sub(r"^\d+ ", "", row).strip()
    cols_split = re.split(r" ([A-Z])", row, 1)
    cols = [cols_split[0]]
    for idx, (c, next_c) in enumerate(batched(cols_split[1:], 2)):
        cols.append(c + next_c)
    print(cols)
    for idx, c in enumerate(cols):
        tables[idx].append(c)

data = []
for idx, table in enumerate(tables):
    data.append({"title": headers[idx], "items": table})
result = json.dumps(data, indent=2)
print(result)
pyperclip.copy(result)
