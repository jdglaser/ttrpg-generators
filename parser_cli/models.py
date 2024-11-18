from itertools import pairwise
from typing import Annotated, Any, Literal, Optional

import pydantic
from pydantic import Tag, field_validator
from pydantic.alias_generators import to_camel


def discriminator_factory(field: str):
    def _inner(v: Any):
        if isinstance(v, str):
            return "str"
        if isinstance(v, dict):
            return v[field]

        return getattr(v, field)

    return _inner


class BaseModel(pydantic.BaseModel):
    model_config = pydantic.ConfigDict(extra="forbid", frozen=True, alias_generator=to_camel)


class TableTextResult(BaseModel):
    type: Literal["text"]
    title: Optional[str] = None
    value: str
    long_description: Optional[str] = None


class TableRollAgainResult(BaseModel):
    type: Literal["roll_again"]
    value: str
    long_description: Optional[str] = None
    amount: int
    concat: bool = False


TableResult = Annotated[
    Annotated[TableTextResult, Tag("text")] | Annotated[TableRollAgainResult, Tag("roll_again")],
    pydantic.Discriminator(discriminator_factory("type")),
]


class TableSingleValueOption(BaseModel):
    type: Literal["single"]
    value: int
    result: TableResult


class TableRangeValueOption(BaseModel):
    type: Literal["range"]
    min_value: int
    max_value: int
    result: TableResult


TableOption = Annotated[
    Annotated[TableSingleValueOption, Tag("single")] | Annotated[TableRangeValueOption, Tag("range")],
    pydantic.Discriminator(discriminator_factory("type")),
]


class TableValidationException(Exception): ...


class Dice(BaseModel):
    num_dice: int = 1
    dice_sides: int

    @field_validator("num_dice", mode="before")
    def resolve_type_abbreviation(data: Any) -> Any:
        if data is None:
            return 1

        return data


class Table(BaseModel):
    dice: Dice
    title: str
    table: list[TableOption]

    @pydantic.field_validator("table")
    def enforce_continous_table_options(cls: "Table", table: list[TableOption]):
        for val, next_val in list(pairwise(table)) + [(table[-1], None)]:
            next_val_int = None
            if next_val:
                next_val_int = next_val.min_value if isinstance(next_val, TableRangeValueOption) else next_val.value
            if isinstance(val, TableRangeValueOption):
                if val.max_value <= val.min_value:
                    raise TableValidationException("TableRangeValue Option must have a max_value > min_value")

                if next_val_int and val.max_value >= next_val_int:
                    raise TableValidationException("TableOption values must be continuous")
            else:
                if next_val_int and val.value >= next_val_int:
                    raise TableValidationException("TableOption values must be continuous")

        return table


class HeadersConfig(BaseModel):
    type: Literal["numbers", "title_case"]
    tables: int
    dice: Dice
    headers: list[str]
