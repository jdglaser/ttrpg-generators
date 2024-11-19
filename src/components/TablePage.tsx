import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppState } from "../common/hooks";
import {
  Optional,
  RollOnTableResult,
  RollOnTableResultResult,
  RollOnTableRollAgainResult,
  RollOnTableStandardResult,
  TableResult,
} from "../common/types";
import { copyToClipboard, dashToTitleCase, rollOnTable } from "../common/utils";

function DisplayValue({ result }: { result: TableResult }) {
  const { value, longDescription } = result;
  return longDescription ? (
    <span>
      {value}. {longDescription}
    </span>
  ) : (
    <span>{value}</span>
  );
}

function StandardResultItem({
  rollOnTableResult,
  tableTitle = null,
}: {
  rollOnTableResult: RollOnTableStandardResult;
  tableTitle?: Optional<string>;
}) {
  const { result } = rollOnTableResult;

  return (
    <li>
      {tableTitle ? <b>{tableTitle}: </b> : null}
      <DisplayValue result={result} />
    </li>
  );
}

function RollAgainResultItem({
  rollOnTableResult,
  tableTitle = null,
}: {
  rollOnTableResult: RollOnTableRollAgainResult;
  tableTitle?: Optional<string>;
}) {
  const { result, rollAgainResults } = rollOnTableResult;

  if (result.concat) {
    return (
      <li>
        {tableTitle ? <b>{tableTitle}: </b> : null}
        <DisplayValue result={result} />
        {rollAgainResults.map((r) => (
          <DisplayValue key={`${result.value}-${r.value}`} result={r} />
        ))}
      </li>
    );
  }

  return (
    <li>
      {tableTitle ? <b>{tableTitle}: </b> : null}
      <DisplayValue result={result} />
      <ul>
        {rollAgainResults.map((r) => (
          <li key={r.value}>
            <DisplayValue result={r} />
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function TablePage() {
  const { category } = useParams();
  const { tables } = useAppState();
  const [results, setResults] = useState<Record<string, RollOnTableResult>>({});

  const categoryTitle = dashToTitleCase(category!);
  const selectedTables = tables[category!];

  function handleCopy() {
    const tableResultsHtml =
      document.getElementsByClassName("results")[0].innerHTML;
    copyToClipboard(tableResultsHtml);
  }

  function handleRefresh() {
    const results = fetchResults();
    setResults(results);
  }

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const results = fetchResults();
    setResults(results);
  }, [category]);

  function fetchResults(keys?: string[]) {
    const tableResults = Object.entries(selectedTables)
      .filter(([key, ,]) => {
        return keys ? keys.includes(key) : true;
      })
      .reduce((acc, [key, table]) => {
        const results: RollOnTableResultResult[] = [];
        while (results.length < (table.amount ?? 1)) {
          const result = rollOnTable(table);
          if (!results.map((r) => r.roll).includes(result.roll)) {
            results.push(result);
          }
        }
        acc[key] = {
          table,
          results,
        };
        return acc;
      }, {} as Record<string, RollOnTableResult>);
    return tableResults;
  }

  console.log(results);

  const resultComponents = Object.entries(results).map(
    ([key, rollOnTableResults]) => {
      if (rollOnTableResults.results.length === 1) {
        const rollOnTableResult = rollOnTableResults.results[0];
        if (rollOnTableResult.type === "rollAgain") {
          return (
            <RollAgainResultItem
              key={key}
              rollOnTableResult={rollOnTableResult}
              tableTitle={rollOnTableResults.table.title}
            />
          );
        }

        return (
          <StandardResultItem
            key={key}
            rollOnTableResult={rollOnTableResult}
            tableTitle={rollOnTableResults.table.title}
          />
        );
      }

      const rollOnTableResultComponents = rollOnTableResults.results.map(
        (rollOnTableResult, idx) => {
          if (rollOnTableResult.type === "rollAgain") {
            return (
              <RollAgainResultItem
                key={`${key}-${idx}`}
                rollOnTableResult={rollOnTableResult}
              />
            );
          }

          return (
            <StandardResultItem
              key={`${key}-${idx}`}
              rollOnTableResult={rollOnTableResult}
            />
          );
        }
      );

      return (
        <li key={rollOnTableResults.table.title}>
          <b>{rollOnTableResults.table.title}</b>
          <ul>{rollOnTableResultComponents}</ul>
        </li>
      );
    }
  );

  return (
    <div>
      <h2>{categoryTitle}</h2>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handleRefresh}>Refresh</button>
        <button onClick={handleCopy}>Copy</button>
      </div>
      <div className="results">
        <ul>{resultComponents}</ul>
      </div>
    </div>
  );
}
