import { createContext, useMemo } from "react";
import { io } from "socket.io-client";



const SocketContext = createContext();


const SocketProvider = ({ children }) => {

    const backendURL = import.meta.env.VITE_APP_API_URL
    const socket = useMemo(
        () => io(backendURL, {
            withCredentials: true,
        }),
    [backendURL]);


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export {SocketProvider, SocketContext};