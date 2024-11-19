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


class Dice(BaseModel):
    num_dice: int = 1
    dice_sides: int

    @field_validator("num_dice", mode="before")
    def resolve_type_abbreviation(data: Any) -> Any:
        if data is None:
            return 1

        return data


class TableTextRowResult(BaseModel):
    type: Literal["text"]
    value: str
    long_description: Optional[str] = None


class TableRollAgainResult(BaseModel):
    type: Literal["rollAgain"]
    amount: int
    value: str
    long_description: Optional[str] = None
    concat: bool = False
    new_dice: Optional[Dice] = None


TableResult = Annotated[
    Annotated[TableTextRowResult, Tag("text")] | Annotated[TableRollAgainResult, Tag("rollAgain")],
    pydantic.Discriminator(discriminator_factory("type")),
]


class TableRowSingleNumber(BaseModel):
    type: Literal["single"]
    value: int


class TableRowRangeNumber(BaseModel):
    type: Literal["range"]
    min_value: int
    max_value: int


TableRowNumber = Annotated[
    Annotated[TableRowSingleNumber, Tag("single")] | Annotated[TableRowRangeNumber, Tag("range")],
    pydantic.Discriminator(discriminator_factory("type")),
]


class TableRow(BaseModel):
    number: TableRowNumber
    result: TableResult


class TableValidationException(Exception): ...


class Table(BaseModel):
    dice: Dice
    title: str
    rows: list[TableRow]

    @pydantic.field_validator("rows")
    def enforce_continous_table_options(cls: "Table", rows: list[TableRow]):
        for val, next_val in list(pairwise(rows)) + [(rows[-1], None)]:
            next_val_int = None
            if next_val:
                next_val_int = (
                    next_val.number.min_value
                    if isinstance(next_val.number, TableRowRangeNumber)
                    else next_val.number.value
                )
            if isinstance(val.number, TableRowRangeNumber):
                if val.number.max_value <= val.number.min_value:
                    raise TableValidationException("TableRowRangeNumber must have a max_value > min_value")

                if next_val_int and val.number.max_value >= next_val_int:
                    raise TableValidationException("TableRow values must be continuous")
            else:
                if next_val_int and val.number.value >= next_val_int:
                    raise TableValidationException("TableOption values must be continuous")

        return rows


class HeadersConfig(BaseModel):
    type: Literal["numbers", "title_case"]
    tables: int
    dice: Dice
    headers: list[str]
