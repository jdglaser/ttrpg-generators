import { useState } from "react";
import { NavLink, useMatch } from "react-router-dom";

interface ExpandableNavElement {
  path: string;
  label: string;
}

interface ExpandableNavItemProps {
  rootLabel: string;
  items: ExpandableNavElement[];
  matchPath: string;
}

export function ExpandableNavItem({
  items,
  rootLabel,
  matchPath,
}: ExpandableNavItemProps) {
  const match = useMatch(matchPath);
  const [expanded, setExpanded] = useState<boolean>(match ? true : false);

  const root = (
    <a
      href=""
      onClick={(event) => {
        event.preventDefault();
        setExpanded((prev) => !prev);
      }}
      style={{ color: match ? "purple" : "blue" }}
    >
      {rootLabel}
    </a>
  );

  const subLinks = items.map(({ path, label }) => (
    <NavLink
      key={path}
      to={path}
      end
      style={({ isActive }) => ({
        color: isActive ? "purple" : "blue",
      })}
    >
      {label}
    </NavLink>
  ));

  return (
    <div>
      {root}
      <div
        style={{
          padding: "0.25rem 0 0 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          visibility: expanded ? "visible" : "hidden",
          maxHeight: expanded ? "" : "0",
        }}
      >
        {subLinks}
      </div>
    </div>
  );
}
