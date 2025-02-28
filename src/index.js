import React from "react";
import ReactDOM from "react-dom/client"; // <-- Import correto para React 18
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from "./App";


const root = ReactDOM.createRoot(document.getElementById("root")); // <-- Método correto
root.render(
  <BrowserRouter basename="/aquasanidade">
    <App />
  </BrowserRouter>
);
