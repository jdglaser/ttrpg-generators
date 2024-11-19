import {
  Dice,
  RollOnTableResultResult,
  RollOnTableRollAgainResult,
  RollOnTableStandardResult,
  Table,
  TableTextResult,
} from "./types";

export async function getData(name: string) {
  const res = await fetch(`/src/data/${name}.json`);
  return await res.json();
}

function getRandomNumberInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function rollDice(dice: Dice) {
  let results = 0;
  for (let i = 0; i < dice.numDice; i++) {
    results += getRandomNumberInclusive(1, dice.diceSides);
  }
  return results;
}

function getResultOnTable(table: Table, rollResult: number) {
  for (const row of table.rows) {
    if (row.number.type == "single" && rollResult === row.number.value) {
      return row;
    }

    if (
      row.number.type === "range" &&
      rollResult >= row.number.minValue &&
      rollResult <= row.number.maxValue
    ) {
      return row;
    }
  }

  throw Error(
    `Cannot find result in table ${table.title} for roll result ${rollResult}`
  );
}

export function rollOnTable(table: Table): RollOnTableResultResult {
  const rollResult = rollDice(table.dice);
  const tableRow = getResultOnTable(table, rollResult);
  const tableRowResult = tableRow.result;
  if (tableRowResult.type === "rollAgain") {
    const results: TableTextResult[] = [];
    const rolls: number[] = [];
    while (results.length < tableRowResult.amount) {
      const newRollResult = rollDice(
        tableRowResult.newDice ? tableRowResult.newDice : table.dice
      );
      const newRow = getResultOnTable(table, newRollResult);
      if (newRow.result.type !== "rollAgain") {
        results.push(newRow.result);
        rolls.push(newRollResult);
      }
    }
    const result: RollOnTableRollAgainResult = {
      type: "rollAgain",
      roll: rollResult,
      result: tableRowResult,
      rollAgainResults: results,
      rollAgainRolls: rolls,
    };
    return result;
  }

  const result: RollOnTableStandardResult = {
    type: "standard",
    roll: rollResult,
    result: tableRowResult,
  };

  return result;
}

export function copyToClipboard(text: string) {
  const blob = new Blob([text], { type: "text/html" });
  const clipboardItem = new window.ClipboardItem({ "text/html": blob });
  navigator.clipboard.write([clipboardItem]);
}

export function dashToTitleCase(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
