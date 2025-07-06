import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";
import ChatProvider from './Context/ChatProvider';
import LandingPage from "./pages/LandingPage";


const App = () => {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" Component={ LandingPage } />
          <Route path="/auth" Component={ HomePage } />
          <Route path="/chats" Component={ ChatsPage } />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
};

export default App;
