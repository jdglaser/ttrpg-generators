import json
import re

import pyperclip

# d20 Disputes With a Neighboring State
data = """
d20 Optional Physical Quirks or Traits
1 They possess an extra eye somewhere
2 An additional set of limbs or extremities
3 Extremely pronounced sexual dimorphism
4 Patches of feathers, scales, fur, or the like
5 They have a tail of some sort
6 They possess wings, whether useful or not
7 Their skin is an unusual texture
8 Sigil-marked by their creator in some way
9 The sexes look very similar to outsiders
10 They have a particular scent to them
11 Their voices are peculiar in some way
12 Additional or too few fingers or toes
13 They have animalistic features in some way
14 Have one or more manipulatory tentacles
15 They have light-emitting organs or skin
16 Their mouths are fanged or tusked
17 They have alien Outsider features somehow
18 Their proportions are distinctly strange
19 They don’t show age the way others do
20 Roll twice and blend the results
"""

char_replacements = [("\u2018", "'"), ("\u2019", "'"), ("\u201c", '"'), ("\u201d", '"')]

data = [r for r in data.split("\n") if r != ""]
final = []
for row in data[1:]:
    if row == "":
        continue

    for c, r in char_replacements:
        row = row.replace(c, r)

    row = re.sub(r"^\d+ ", "", row).strip()
    final.append(row)

title = data[0]
for c, r in char_replacements:
    title = title.replace(c, r)
title = re.sub(r"^d\d+ ", "", title).strip()

final_data = {"title": title, "type": "standard", "items": final}
string_result = json.dumps(final_data, indent=2)
print(string_result)
pyperclip.copy(string_result)
