import { Table, TableRow } from "./types";

export async function getData(name: string) {
    const res = await fetch(`/src/data/${name}.json`);
    return await res.json()
}

export function sample<T>(arr: T[], select: number = 1) {
    const results: T[] = []
    while (results.length < select) {
        const selection = arr[Math.floor(Math.random() * arr.length)]
        if (!results.includes(selection)) {
            results.push(selection)
        }
    }
    return results
}

function rollDice()

function getResultOnTable(table: Table, rollResult: number) {
    for (const row of table.table) {
        if (row.type == "single" && rollResult === row.value) {
            return row
        }

        if (row.type === "range" && rollResult >= row.minValue && rollResult <= row.maxValue) {
            return row
        }
    }

    throw Error(`Cannot find result in table ${table.title} for roll result ${rollResult}`)
}

export function rollOnTable(table: Table) {
    const results: TableRow[] = []
    while (results.length < (table.amount ?? 1)) {

    }
}

export function copyToClipboard(text: string) {
    const blob = new Blob([text], { type: 'text/html' });
    const clipboardItem = new window.ClipboardItem({ 'text/html': blob });
    navigator.clipboard.write([clipboardItem]);
}

export function dashToTitleCase(text: string) {
    return text
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// function resolveResult(initialResult: string | ComplexTableOption | RollAgainTableOption | RollAgainAndBlendOption, items: (string | ComplexTableOption | RollAgainTableOption | RollAgainAndBlendOption)[]): (string | ComplexTableOption)[] {
//     if (typeof initialResult === "string") {
//         return [initialResult];
//     }

//     if (initialResult.type === "rollAgain") {
//         let newResult = sample(items, 1);
//         while (newResult[0] === initialResult) {
//             newResult = sample(items, 1);
//         }
//         return [`${initialResult.text}${newResult}`];
//     }

//     if (initialResult.type === "rollAgainAndBlend") {
//         const newOptions = items.filter((i) => i !== initialResult) as (string)[];
//         console.log("NEW OPTIONS:", newOptions);
//         const newResult = sample(newOptions, initialResult.amount)
//         return [...newResult.map(r => resolveResult(r, newOptions)).flat()]
//     }

//     return [initialResult];
// }

// export function resolveStandardTableResults(items: (string | ComplexTableOption | RollAgainTableOption | RollAgainAndBlendOption)[], select: number) {
//     const results = sample(items, select ?? 1);
//     const finalResults: (string | ComplexTableOption)[] = results.map((r) => {
//         return resolveResult(r, items)
//     }).flat();

//     return finalResults;
// }