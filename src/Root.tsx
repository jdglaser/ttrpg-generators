import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import { AppStateContext } from "./common/context";
import { Optional, Tables, Tags } from "./common/types";
import { getData } from "./common/utils";

export default function Root() {
  const [tables, setTables] = useState<Optional<Tables>>(null);
  const [tags, setTags] = useState<Optional<Tags>>(null);

  useEffect(() => {
    getData("tables").then((res) => {
      setTables(res);
    });

    getData("tags").then((res) => {
      setTags(res);
    });
  }, []);

  if (!tables || !tags) {
    return <div>Loading</div>;
  }

  return (
    <AppStateContext.Provider value={{ tables, tags }}>
      <div
        className="root"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.75rem",
        }}
      >
        <div>
          <Nav />
        </div>
        <div
          style={{
            padding: "1rem 2rem",
          }}
        >
          <Outlet />
        </div>
      </div>
    </AppStateContext.Provider>
  );
}
