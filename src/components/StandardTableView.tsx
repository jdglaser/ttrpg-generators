import { useEffect } from "react";
import { StandardTable } from "../common/types";

export function StandardTableView({
  table,
  results,
  setResults,
}: {
  table: StandardTable;
  results: string[];
  setResults: () => void;
}) {
  const select = table.select ?? 1;

  useEffect(() => {
    setResults();
  }, []);

  if (!results.length) {
    return <></>;
  }

  return (
    <li>
      <b style={{ cursor: "pointer" }} onClick={setResults}>
        {table.title}:{" "}
      </b>
      {select === 1 ? (
        results[0]
      ) : (
        <ul>
          {results.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
