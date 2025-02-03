import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";
import "./styles/App.css";
import ChatProvider from './Context/ChatProvider';


const App = () => {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" Component={ HomePage } />
          <Route path="/chats" Component={ ChatsPage } />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
};

export default App;
