import { useEffect } from "react";
import { ComplexTableOption, StandardTable } from "../common/types";

export function StandardTableView({
  table,
  results,
  setResults,
}: {
  table: StandardTable;
  results: (string | ComplexTableOption)[];
  setResults: () => void;
}) {
  useEffect(() => {
    setResults();
  }, []);

  if (!results.length) {
    return <></>;
  }

  if (results.length === 1) {
    const firstResult = results[0];
    const item =
      typeof firstResult === "string" ? (
        firstResult
      ) : (
        <ul>
          <li>
            <b>
              {firstResult.title}, {firstResult.tag}:{" "}
            </b>
            {firstResult.description}
          </li>
        </ul>
      );
    return (
      <li>
        <b style={{ cursor: "pointer" }} onClick={setResults}>
          {table.title}:{" "}
        </b>
        {item}
      </li>
    );
  }

  return (
    <li>
      <b style={{ cursor: "pointer" }} onClick={setResults}>
        {table.title}:{" "}
      </b>
      <ul>
        {results.map((r) => {
          if (typeof r === "string") {
            return <li key={r}>r</li>;
          }

          return (
            <li key={r.title}>
              <b>
                {r.title}, {r.tag}:{" "}
              </b>
              {r.description}
            </li>
          );
        })}
      </ul>
    </li>
  );
}
