import React from 'react'
import { Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ChatsPage from './pages/ChatsPage';
import './App.css'
const App = () => {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatsPage} />
    </div>
  );
}

export default App
