import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <BrowserRouter basename="/Tokei">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}