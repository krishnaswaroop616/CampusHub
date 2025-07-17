import React, { useState ,useEffect} from 'react';
import { createContext, useContext } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("token");

        if (storedUserId && storedToken) {
            try{
                const decoded=jwtDecode(storedToken);
                const now=Date.now()/1000;

                if(decoded.exp<now){
                    console.log("Token expired. Logging out");
                    localStorage.clear();
                    setToken("");
                    setUserId("");
                }
                else{
                    setUserId(storedUserId);
                    setToken(storedToken);  
                }
            }
            catch(err){
                console.log("Invalid token",err);
                localStorage.clear();
                setToken("");
                setUserId("");
            }
        }
    }, []);

    const login = (userData, tokenData) => {
        setUserId(userData);
        setToken(tokenData);
        localStorage.setItem("token", tokenData);
        localStorage.setItem("userId", userData);
    }

    const logout = () => {
        setUserId("");
        setToken("");
        localStorage.clear();
        window.location.href="/login";
        alert("Logout successful");
    }

    const values = {
        login, logout, userId, token,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);