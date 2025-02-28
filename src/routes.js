import React from "react";
import { Routes, Route } from "react-router-dom";
import SanityAnalysis from "./pages/SanityAnalysis";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SanityAnalysis />} />
            <Route path="/aquadata" element={<SanityAnalysis />} />

        </Routes>
    );
};

export default AppRoutes;
