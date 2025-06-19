// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./main.css";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import "./main.css";
import { router } from "./route";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
