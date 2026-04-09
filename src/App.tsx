import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LoginCard } from "./components/LoginCard";
import { ChatInterface } from "./components/ChatInterface";

function Login() {
  return (
    <Layout>
      <LoginCard />
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </BrowserRouter>
  );
}
