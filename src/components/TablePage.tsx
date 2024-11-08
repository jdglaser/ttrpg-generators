import { useParams } from "react-router-dom";
import { useAppState } from "../common/hooks";

export default function TablePage() {
  const { category, group } = useParams();
  const { tables, tags } = useAppState();

  console.log("TABLES:", tables);
  console.log("TAGS:", tags);

  const selectedCategory = tables.categories[category!];

  const selectedTables =
    selectedCategory.type === "multi"
      ? selectedCategory.groups[group!]
      : selectedCategory.tables;

  return (
    <div>
      <h2>{selectedCategory.title}</h2>
      <h3>{selectedTables.title}</h3>
    </div>
  );
}
