import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import data from "./assets/data/table_ref_v2.json";
import { AppStateContext } from "./common/context";
import { Optional, Tables } from "./common/types";
import { accessPropertyByPath } from "./common/utils";
import Nav from "./Nav";

export default function Root() {
  const [tables, setTables] = useState<Optional<Tables>>(null);

  useEffect(() => {
    const parsedTables: Record<string, any> = {};
    for (const [categoryKey, tables] of Object.entries(
      data["tables"] as Record<string, any>
    )) {
      const parsedCategory: Record<string, any> = {};
      for (const [tableKey, table] of Object.entries(
        tables as Record<string, any>
      )) {
        let parsedTable = table;
        if ("ref" in table) {
          const ref = accessPropertyByPath(data, table["ref"]);
          parsedTable = { ...parsedTable, ...ref };
        }
        parsedCategory[tableKey] = parsedTable;
      }
      parsedTables[categoryKey] = parsedCategory;
    }
    setTables(parsedTables);
  }, []);

  if (!tables) {
    return <div>Loading</div>;
  }

  return (
    <AppStateContext.Provider value={{ tables }}>
      <div
        className="root"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.75rem",
          height: "100dvh",
        }}>
        <div>
          <Nav />
        </div>
        <div
          style={{
            padding: "1rem 4rem",
            overflow: "auto",
          }}>
          <Outlet />
        </div>
      </div>
    </AppStateContext.Provider>
  );
}
