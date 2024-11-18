export type Optional<T> = T | null

export interface AppState {
    tables: Tables;
}

export type Tables = Record<string, Record<string, Table>>

interface Dice {
    numDice: number
    diceSides: number
}

export interface Table {
    dice: Dice
    amount?: number
    title: string
    table: TableRow[]
}

export type TableRow = TableRowSingle | TableRowRange

interface TableRowSingle {
    type: "single"
    value: number
    result: TableResult
}

interface TableRowRange {
    type: "range"
    minValue: number
    maxValue: number
    result: TableResult
}

export type TableResult = TableTextResult | TableRollAgainResult

interface TableTextResult {
    type: "text"
    title?: Optional<string>
    value: string
    longDescription?: Optional<string>
}

interface TableRollAgainResult {
    type: "rollAgain"
    title?: Optional<string>
    longDescription?: Optional<string>
    amount: number
    concat?: boolean
}