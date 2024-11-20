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
  refreshFunc = null,
}: {
  rollOnTableResult: RollOnTableStandardResult;
  tableTitle?: Optional<string>;
  refreshFunc?: Optional<() => void>;
}) {
  const { result } = rollOnTableResult;
  let tableTitleComponent = null;
  if (tableTitle) {
    const tableTitleSep = tableTitle.endsWith("?") ? "" : ":";
    if (refreshFunc) {
      tableTitleComponent = (
        <b style={{ cursor: "pointer" }} onClick={refreshFunc}>
          {tableTitle}
          {tableTitleSep}{" "}
        </b>
      );
    } else {
      tableTitleComponent = (
        <b>
          {tableTitle}
          {tableTitleSep}{" "}
        </b>
      );
    }
  }
  return (
    <li>
      {tableTitleComponent}
      <DisplayValue result={result} />
    </li>
  );
}

function RollAgainResultItem({
  rollOnTableResult,
  tableTitle = null,
  refreshFunc = null,
}: {
  rollOnTableResult: RollOnTableRollAgainResult;
  tableTitle?: Optional<string>;
  refreshFunc?: Optional<() => void>;
}) {
  const { result, rollAgainResults } = rollOnTableResult;

  let tableTitleComponent = null;
  if (tableTitle) {
    const tableTitleSep = tableTitle.endsWith("?") ? "" : ":";
    if (refreshFunc) {
      tableTitleComponent = (
        <b style={{ cursor: "pointer" }} onClick={refreshFunc}>
          {tableTitle}
          {tableTitleSep}{" "}
        </b>
      );
    } else {
      tableTitleComponent = (
        <b>
          {tableTitle}
          {tableTitleSep}{" "}
        </b>
      );
    }
  }

  if (result.concat) {
    return (
      <li>
        {tableTitleComponent}
        <DisplayValue result={result} />
        {rollAgainResults.map((r) => (
          <DisplayValue key={`${result.value}-${r.value}`} result={r} />
        ))}
      </li>
    );
  }

  return (
    <li>
      {tableTitleComponent}
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

  function handleRefresh(keys?: string[]) {
    const results = fetchResults(keys);
    if (!keys) {
      setResults(results);
    } else {
      setResults((prev) => ({ ...prev, ...results }));
    }
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
          tableKey: key,
          table,
          results,
        };
        return acc;
      }, {} as Record<string, RollOnTableResult>);
    return tableResults;
  }

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
              refreshFunc={() => handleRefresh([rollOnTableResults.tableKey])}
            />
          );
        }

        return (
          <StandardResultItem
            key={key}
            rollOnTableResult={rollOnTableResult}
            tableTitle={rollOnTableResults.table.title}
            refreshFunc={() => handleRefresh([rollOnTableResults.tableKey])}
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
          <b
            style={{ cursor: "pointer" }}
            onClick={() => handleRefresh([rollOnTableResults.tableKey])}
          >
            {rollOnTableResults.table.title}
          </b>
          <ul>{rollOnTableResultComponents}</ul>
        </li>
      );
    }
  );

  return (
    <div>
      <h2>{categoryTitle}</h2>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={() => handleRefresh()}>Refresh</button>
        <button onClick={handleCopy}>Copy</button>
      </div>
      <div className="results">
        <ul>{resultComponents}</ul>
      </div>
    </div>
  );
}
