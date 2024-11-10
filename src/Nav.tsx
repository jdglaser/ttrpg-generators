import { useState } from "react";
import { NavLink } from "react-router-dom";
import closeMenu from "./assets/close.png";
import menuHamburger from "./assets/menu.png";
import { useAppState } from "./common/hooks";
import { ExpandableNavItem } from "./components/ExpandableNavItem";

export default function Nav() {
  const [showNav, setShowNav] = useState<boolean>(true);
  const { tables } = useAppState();

  const tableRoutes = Object.entries(tables.categories)
    .map(([key, entry]) => {
      const link =
        entry.type === "single" ? (
          <NavLink
            key={`/tables/${key}`}
            to={`/tables/${key}`}
            style={({ isActive }) => ({
              color: isActive ? "purple" : "blue",
            })}
            end
          >
            {entry.title}
          </NavLink>
        ) : (
          <ExpandableNavItem
            items={Object.entries(entry.groups).map(
              ([innerKey, innerEntry]) => ({
                label: innerEntry.title,
                path: `/tables/${key}/${innerKey}`,
              })
            )}
            rootLabel={entry.title}
            matchPath={`/tables/${key}/:group`}
          />
        );

      return <div key={`navGroup-${key}`}>{link}</div>;
    })
    .flat();

  return (
    <div
      style={{
        borderRight: showNav ? "1px solid lightgrey" : "",
        minHeight: "100vh",
        minWidth: showNav ? "150px" : "0px",
      }}
    >
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          padding: "1rem",
        }}
        onClick={() => setShowNav((prev) => !prev)}
        role="button"
      >
        {showNav ? (
          <img src={closeMenu} width="20px" height="20px" />
        ) : (
          <img src={menuHamburger} width="25px" height="25px" />
        )}
      </div>
      <div
        style={{
          display: showNav ? "flex" : "none",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "1rem",
        }}
      >
        <NavLink
          to="/"
          style={({ isActive }) => ({
            color: isActive ? "purple" : "blue",
          })}
          end
        >
          Home
        </NavLink>
        {tableRoutes}
      </div>
    </div>
  );
}
