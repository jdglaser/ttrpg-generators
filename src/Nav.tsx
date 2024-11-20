import { useState } from "react";
import { NavLink } from "react-router-dom";
import closeMenu from "./assets/close.png";
import menuHamburger from "./assets/menu.png";
import { useAppState } from "./common/hooks";
import { dashToTitleCase } from "./common/utils";

export default function Nav() {
  const [showNav, setShowNav] = useState<boolean>(false);
  const { tables } = useAppState();

  const tableRoutes = Object.keys(tables)
    .map((key) => {
      const link = (
        <NavLink
          key={`/tables/${key}/`}
          to={`/ttrpg-generators/tables/${key}/`}
          style={({ isActive }) => ({ color: isActive ? "purple" : "blue" })}
          onClick={() => setShowNav(false)}>
          {dashToTitleCase(key)}
        </NavLink>
      );

      return <div key={`navGroup-${key}`}>{link}</div>;
    })
    .flat();

  return (
    <>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          padding: "1rem",
          zIndex: 1001,
        }}
        onClick={() => setShowNav((prev) => !prev)}
        role="button">
        {showNav ? (
          <img src={closeMenu} width="20px" height="20px" />
        ) : (
          <img src={menuHamburger} width="25px" height="25px" />
        )}
      </div>
      <div
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          width: showNav ? "100vw" : 0,
          height: showNav ? "100vh" : 0,
          backgroundColor: "black",
          opacity: "25%",
          zIndex: 999,
        }}></div>
      <div
        style={{
          ...{
            borderRight: showNav ? "1px solid lightgrey" : "",
            padding: showNav ? "0 2rem" : 0,
            width: "max-content",
            height: "100vh",
            maxHeight: "100vh",
            overflow: "auto",
            position: "absolute",
          },
          ...(showNav ? { zIndex: 1000, backgroundColor: "white" } : {}),
        }}>
        <div
          style={{
            display: showNav ? "flex" : "none",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "1rem",
            marginTop: "25px",
            marginLeft: "0.75rem",
          }}>
          <NavLink
            to="/ttrpg-generators/"
            style={({ isActive }) => ({
              color: isActive ? "purple" : "blue",
            })}
            end
            onClick={() => setShowNav(false)}>
            Home
          </NavLink>
          {tableRoutes}
        </div>
      </div>
    </>
  );
}
