import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import { AppStateContext } from "./common/context";
import { Optional, Tables } from "./common/types";
import { accessPropertyByPath, getData } from "./common/utils";

export default function Root() {
  const [tables, setTables] = useState<Optional<Tables>>(null);

  useEffect(() => {
    getData("table_ref_v2").then((res) => {
      const parsedTables: Record<string, any> = {};
      for (const [categoryKey, tables] of Object.entries(
        res["tables"] as Record<string, any>
      )) {
        const parsedCategory: Record<string, any> = {};
        for (const [tableKey, table] of Object.entries(
          tables as Record<string, any>
        )) {
          let parsedTable = table;
          if ("ref" in table) {
            const ref = accessPropertyByPath(res, table["ref"]);
            parsedTable = { ...parsedTable, ...ref };
          }
          parsedCategory[tableKey] = parsedTable;
        }
        parsedTables[categoryKey] = parsedCategory;
      }
      setTables(parsedTables);
    });
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
          height: "100vh",
        }}>
        <div>
          <Nav />
        </div>
        <div
          style={{
            padding: "1rem 2rem",
            overflow: "auto",
          }}>
          <Outlet />
        </div>
      </div>
    </AppStateContext.Provider>
  );
}
