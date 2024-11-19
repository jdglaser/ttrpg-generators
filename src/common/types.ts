export type Optional<T> = T | null

export interface AppState {
    tables: Tables;
}

export type Tables = Record<string, Record<string, Table>>

export interface Dice {
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

export interface TableTextResult {
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
    newDice?: Dice
}

export interface RollOnTableRollAgainResult {
    type: "rollAgain"
    roll: number
    result: TableRollAgainResult
    rollAgainRolls: number[]
    rollAgainResults: TableTextResult[]
}

export interface RollOnTableStandardResult {
    type: "standard"
    roll: number
    result: TableTextResult
}

export type RollOnTableResult = RollOnTableRollAgainResult | RollOnTableStandardResult