import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EncounterPage from "./components/EncounterPage.tsx";
import Home from "./components/Home.tsx";
import TablePage from "./components/TablePage.tsx";
import ErrorPage from "./ErrorPage.tsx";
import "./index.css";
import Root from "./Root.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "tables/:category",
        element: <TablePage />,
        children: [
          {
            path: ":group",
            element: <TablePage />,
          },
        ],
      },
      {
        path: "encounters",
        element: <EncounterPage />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
