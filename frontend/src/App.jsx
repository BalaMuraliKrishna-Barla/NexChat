import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";
import "./styles/App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={ HomePage } />
        <Route path="/chats" Component={ ChatsPage } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
