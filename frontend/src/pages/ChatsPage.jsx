import React, { useEffect, useState } from 'react'
import axios from 'axios'
const ChatsPage = () => {

    // const [chats, setChats] = useState([])
    // const fetchChats = async () => {
    //     const {data} = await axios.get("/api/chats")
    //     setChats(data);
    //     console.log("Got chats", data);
        
        
    // }

    // useEffect(() => {
    //   fetchChats();
    // }, [])
    

  return (
    // <div>
    //     <ul style={{ paddingLeft: '20px' }}>    
    //     { chats.map((chat) => ( <li key={chat._id}>{chat.chatName}</li> ))}
    //     </ul>
    // </div>
    <div>
      <h1>Chats page!</h1>
    </div>
  )
}

export default ChatsPage
