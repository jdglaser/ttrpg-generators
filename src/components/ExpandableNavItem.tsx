import { useState } from "react";
import { Link } from "react-router-dom";

interface ExpandableNavElement {
  path: string;
  label: string;
}

interface ExpandableNavItemProps {
  rootLabel: string;
  items: ExpandableNavElement[];
}

export function ExpandableNavItem({
  items,
  rootLabel,
}: ExpandableNavItemProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const root = (
    <a
      href=""
      onClick={(event) => {
        event.preventDefault();
        setExpanded((prev) => !prev);
      }}
    >
      {rootLabel}
    </a>
  );

  const subLinks = items.map(({ path, label }) => (
    <Link key={path} to={path}>
      {label}
    </Link>
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
