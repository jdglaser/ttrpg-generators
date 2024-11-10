export type Optional<T> = T | null

export interface AppState {
    tables: Tables;
    tags: Tags;
}

export interface TagTable {
    type: "tag"
    title: string
    select: Optional<number>
    tagRef: string
}

export interface ComplexTableOption {
    type: "complex",
    title: string,
    tag: string,
    description: string
}

export interface StandardTable {
    type: "standard"
    title: string
    select: Optional<number>
    items: (string | ComplexTableOption)[]
}

export type Table = TagTable | StandardTable

export interface TableGroup {
    title: string
    tables: Table[]
}

export interface TableCategoryMulti {
    type: "multi"
    title: string
    groups: Record<string, TableGroup>
}

export interface TableCategorySingle {
    type: "single"
    title: string
    tables: Table[]
}

export type TableCategory = TableCategoryMulti | TableCategorySingle

export interface Tables {
    categories: Record<string, TableCategory>
}

export interface Tag {
    title: string
    description: string
    enemies: string
    friends: string
    complications: string
    things: string
    places: string
}

export interface Tags {
    tags: Record<string, Tag[]>
}