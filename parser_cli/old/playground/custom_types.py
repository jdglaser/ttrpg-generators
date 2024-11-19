from itertools import pairwise
from typing import Any, Type

import pydantic
from pydantic.alias_generators import to_camel


class PlaygroundBaseModel(pydantic.BaseModel):
    model_config = pydantic.ConfigDict(
        extra="forbid",
        frozen=True,
        alias_generator=pydantic.AliasGenerator(serialization_alias=to_camel),
        arbitrary_types_allowed=True,
    )


class BarException(Exception): ...


class Bar(pydantic.BaseModel):
    a: list[int]

    @pydantic.field_validator("a", mode="after")
    def validate_a(cls: "Bar", v: list[int]):
        print("VALIDATE")
        print(type(v))
        print([type(o) for o in v])
        for cur, prev in pairwise(v):
            if not prev > cur:
                raise BarException("a must be continuous")
        return v


bar = Bar(a=[1, 2, 3])
