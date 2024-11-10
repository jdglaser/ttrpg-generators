import { useEffect } from "react";
import { Tag, TagTable } from "../common/types";

function TagItem({ tag }: { tag: Tag }) {
  return (
    <li>
      <b>{tag.title}</b> - {tag.description}
      <ul>
        <li>
          <b>Friends: </b>
          {tag.friends}
        </li>
        <li>
          <b>Enemies: </b>
          {tag.enemies}
        </li>
        <li>
          <b>Complications: </b>
          {tag.complications}
        </li>
        <li>
          <b>Things: </b>
          {tag.things}
        </li>
        <li>
          <b>Places: </b>
          {tag.places}
        </li>
      </ul>
    </li>
  );
}

export function TagTableView({
  table,
  results,
  setResults,
}: {
  table: TagTable;
  results: Tag[];
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
        <ul>
          <TagItem tag={results[0]} />
        </ul>
      ) : (
        <ul>
          {results.map((r) => (
            <TagItem tag={r} key={r.description} />
          ))}
        </ul>
      )}
    </li>
  );
}
