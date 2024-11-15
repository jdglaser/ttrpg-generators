import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppState } from "../common/hooks";
import { ComplexTableOption, Table, Tag } from "../common/types";
import { copyToClipboard, sample } from "../common/utils";
import { StandardTableView } from "./StandardTableView";
import { TagTableView } from "./TagTableView";

export default function TablePage() {
  const { category, group } = useParams();
  const { tables, tags } = useAppState();
  const [results, setResults] = useState<
    Record<string, (string | ComplexTableOption)[] | Tag[]>
  >({});

  function setTableResultsFactory<T extends Table>(table: T) {
    const tableId = table.title;
    let results;
    if (table.type === "standard") {
      results = sample(table.items, table.select ?? 1);
    } else {
      results = sample(tags.tags[table.tagRef], table.select ?? 1);
    }

    return () => {
      setResults((prev) => ({ ...prev, [tableId]: results }));
    };
  }

  const selectedCategory = tables.categories[category!];
  const selectedGroup =
    selectedCategory.type === "multi" ? selectedCategory.groups[group!] : null;

  const selectedTables =
    selectedCategory.type === "multi"
      ? selectedCategory.groups[group!].tables
      : selectedCategory.tables;

  const updateFunctions: (() => void)[] = [];

  function handleRefresh() {
    updateFunctions.forEach((fn) => fn());
  }

  function handleCopy() {
    const tableResultsHtml =
      document.getElementsByClassName("results")[0].innerHTML;
    copyToClipboard(tableResultsHtml);
  }

  const renderedTables = selectedTables.map((table) => {
    const tableId = table.title;
    if (table.type === "standard") {
      const setResultsFunction = setTableResultsFactory(table);
      updateFunctions.push(setResultsFunction);

      return (
        <StandardTableView
          key={tableId}
          table={table}
          results={(results[tableId] as (string | ComplexTableOption)[]) ?? []}
          setResults={setResultsFunction}
        />
      );
    } else {
      const setResultsFunction = setTableResultsFactory(table);
      updateFunctions.push(setResultsFunction);

      return (
        <TagTableView
          key={tableId}
          table={table}
          results={(results[tableId] as Tag[]) ?? []}
          setResults={setResultsFunction}
        />
      );
    }
  });

  return (
    <div>
      <h2>{selectedCategory.title}</h2>
      {selectedGroup ? <h3>{selectedGroup.title}</h3> : null}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handleRefresh}>Refresh</button>
        <button onClick={handleCopy}>Copy</button>
      </div>
      <div className="results">
        <ul>{renderedTables}</ul>
      </div>
    </div>
  );
}
