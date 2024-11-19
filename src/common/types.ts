export type Optional<T> = T | null;

export interface AppState {
  tables: Tables;
}

export type Tables = Record<string, Record<string, Table>>;

export interface Dice {
  numDice: number;
  diceSides: number;
}

export interface Table {
  dice: Dice;
  amount?: number;
  title: string;
  rows: TableRow[];
}

export interface TableRowSingleNumber {
  type: "single";
  value: number;
}

export interface TableRowRangeNumber {
  type: "range";
  minValue: number;
  maxValue: number;
}

export type TableRowNumber = TableRowSingleNumber | TableRowRangeNumber;

export type TableResult = TableTextResult | TableRollAgainResult;

export interface TableTextResult {
  type: "text";
  value: string;
  title?: Optional<string>;
  longDescription?: Optional<string>;
}

export interface TableRollAgainResult {
  type: "rollAgain";
  value: string;
  amount: number;
  longDescription?: Optional<string>;
  concat?: boolean;
  newDice?: Dice;
}

export interface TableRow {
  number: TableRowNumber;
  result: TableResult;
}

export interface RollOnTableRollAgainResult {
  type: "rollAgain";
  roll: number;
  result: TableRollAgainResult;
  rollAgainRolls: number[];
  rollAgainResults: TableTextResult[];
}

export interface RollOnTableStandardResult {
  type: "standard";
  roll: number;
  result: TableTextResult;
}

export type RollOnTableResultResult =
  | RollOnTableRollAgainResult
  | RollOnTableStandardResult;

export interface RollOnTableResult {
  table: Table;
  results: RollOnTableResultResult[];
}
