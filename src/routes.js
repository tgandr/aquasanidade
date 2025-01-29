import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SanityAnalysis from "./pages/SanityAnalysis";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SanityAnalysis />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
