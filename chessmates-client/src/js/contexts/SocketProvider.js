import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { url } from '../constants';
import { useAuth } from './AuthProvider';
const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext);
}


export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const { auth, setAuth } = useAuth();
  // console.log("~ auth", auth);

  useEffect(() => {
    const newSocket = io(url, { query: { auth } })
    setSocket(newSocket)
    console.log("open")
    return () => {
      newSocket.close()
      console.log("closed")
    }
  }, [])

  useEffect(() => {
    if (socket == null) return
    socket.on('update_token', (data) => {

      setAuth(data["auth"]);
      console.log('update_token');
    })

    return () => socket.off('update_auth')
  }, [socket])


  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}