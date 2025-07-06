import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatsPage from "./pages/ChatsPage";
import ChatProvider from './Context/ChatProvider';
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" Component={ LandingPage } />
          {/* <Route path="/auth" Component={ HomePage } /> */}
          <Route path="/chats" Component={ ChatsPage } />
        </Routes>
        <ToastContainer 
          position="bottom-center"
          autoClose={1000}
          hideProgressBar={true}
          closeOnClick={true}
          pauseOnHover={false}
          theme="colored"
        />      
      </ChatProvider>
    </BrowserRouter>
  );
};

export default App;
