// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { ChatState } from '../Context/ChatProvider'
// import SideBar from '../components/miscellaneous/SideBar';
import Header from '../components/Chats/Header';
import Body from '../components/Chats/Body';
import Footer from '../components/Chats/Footer';
const ChatsPage = () => {

  // let { user } = ChatState();
  
  
  

  return (
    <div>
      {/* <h1>Chats page!</h1> */}
      <Header />
      <Body />
      <Footer />
    </div>
  )
}

export default ChatsPage
