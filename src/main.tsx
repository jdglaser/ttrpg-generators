import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.tsx";
import TablePage from "./components/TablePage.tsx";
import ErrorPage from "./ErrorPage.tsx";
import "./index.css";
import Root from "./Root.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        children: [
          {
            path: "tables/:category",
            element: <TablePage />,
          },
          {
            path: "",
            element: <Home />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
