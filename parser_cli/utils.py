def to_id(value: str):
    special_chars_removed = ("".join(e for e in value if e == " " or e.isalnum())).strip()
    return special_chars_removed.replace(" ", "-").lower()
