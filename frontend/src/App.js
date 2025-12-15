import Header from "./components/header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePartyCard from "./pages/createPartyCard";
import AllCards from "./pages/allCards";
import MyCards from "./pages/myCards";
import CardDetails from "./pages/CardDetails";
import PaymentPage from "./pages/PaymentPage";
import { useState } from "react";
// import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isTrue, setITrue] = useState(false);
  return (
    <>
      <Header cangeButton={isTrue} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setChange={setITrue} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/party-cards"
          element={<CreatePartyCard setChange={setITrue} />}
        />
        <Route path="/all-cards" element={<AllCards />} />
        <Route path="/my-cards" element={<MyCards />} />
        <Route path="/card-details/:id" element={<CardDetails />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </>
  );
}

export default App;
