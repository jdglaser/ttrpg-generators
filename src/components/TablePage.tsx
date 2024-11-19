import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppState } from "../common/hooks";
import { TableResult } from "../common/types";
import { copyToClipboard, dashToTitleCase, rollOnTable } from "../common/utils";

function ResultItem({ result }: { result: TableResult }) {
  const title = result.title ? <b>{result.title}: </b> : null;
  const longDescription = result.longDescription ? (
    <span>{result.longDescription}</span>
  ) : null;
  let value = null;
  if (result.type === "text") {
    value =
      title && longDescription ? (
        <span>, {result.value}. </span>
      ) : (
        <span>{result.value}</span>
      );
  }
  return (
    <>
      {title}
      {value}
      {longDescription}
    </>
  );
}

export default function TablePage() {
  const { category } = useParams();
  const { tables } = useAppState();
  const [results, setResults] = useState<Record<string, ReactNode>>({});

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

  function fetchResults() {
    const tableResults = Object.entries(selectedTables).reduce(
      (acc, [key, table]) => {
        console.log(key, table);
        const result = rollOnTable(table);
        console.log(result);
        if (result.type === "rollAgain") {
          acc[key] = (
            <li key={key}>
              <b>{table.title}</b>:
              <ResultItem
                key={`${key}-${result.roll}`}
                result={result.result}
              />
              {result.result.concat ? (
                result.rollAgainResults.join(" ")
              ) : (
                <ul key={key}>
                  {result.rollAgainResults.map((r) => (
                    <li>
                      <ResultItem key={`${key}-${r.value}`} result={r} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
          return acc;
        }

        acc[key] = (
          <li key={key + "2"}>
            <b>{table.title}</b>:{" "}
            <ResultItem key={`${key}-${result.roll}`} result={result.result} />
          </li>
        );
        return acc;
      },
      {} as Record<string, ReactNode>
    );
    return tableResults;
  }

  return (
    <div>
      <h2>{categoryTitle}</h2>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handleRefresh}>Refresh</button>
        <button onClick={handleCopy}>Copy</button>
      </div>
      <div className="results">
        <ul>{Object.values(results)}</ul>
      </div>
    </div>
  );
}
