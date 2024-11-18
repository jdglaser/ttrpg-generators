import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import { AppStateContext } from "./common/context";
import { Optional, Tables } from "./common/types";
import { getData } from "./common/utils";

export default function Root() {
  const [tables, setTables] = useState<Optional<Tables>>(null);

  useEffect(() => {
    getData("table_ref").then((res) => {
      setTables(res);
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
        }}
      >
        <div>
          <Nav />
        </div>
        <div
          style={{
            padding: "1rem 2rem",
            overflow: "auto",
          }}
        >
          <Outlet />
        </div>
      </div>
    </AppStateContext.Provider>
  );
}
