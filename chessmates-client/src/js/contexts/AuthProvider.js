import React, { useContext, useEffect, useState } from 'react';
import { url } from '../constants';
import useSessionStorage from '../hooks/useSessionStorage';
import useLocalStorage from '../hooks/useLocalStorage';
import httpClient from '../httpClient';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [auth, setAuth] = useLocalStorage("auth", null);
    const [refresh, setRefresh] = useLocalStorage("refresh", null);
    const [userData, setUserData] = useSessionStorage("user", null);
    const [changeData, setChangeData] = useState(false);

    useEffect(() => {
        const fet = async () => {
            if (auth == null || refresh == null) return;
            // console.log("~ auth", auth)

            const TARGET = `${url}/update_token_refresh`
            try {
                const res = await httpClient.get(TARGET, {
                    withCredentials: true, headers: {
                        'auth': auth,
                        'refresh': refresh
                    }
                });
                setAuth(res.data["auth"]);
                // console.log("~ res.data", res.data)
            }
            catch (e) {
                // console.log("~ e", e)
                logout()
            }
        }
        fet();
    }, []);

    useEffect(() => {
        const updateUser = async () => {
            if (auth === null) {
                logout()
            }
            else {
                try {
                    const TARGET = `${url}/get_user`
                    const resp = await httpClient.get(TARGET, {
                        withCredentials: true, headers: {
                            'auth': auth
                        }
                    });
                    setUserData(resp.data);
                } catch (e) {
                    alert("There is a problem with authentication. Please log in again")
                }
            }
        };
        console.log("~ updateUser get_user")
        updateUser();

    }, [auth, changeData])





    const logout = () => {
        const TARGET = `${url}/logout`
        try {
            httpClient.get(TARGET, {
                withCredentials: true, headers: {
                    "refresh": refresh
                }
            });

        }
        catch (e) {
            console.log("logout authProvider: ~ e", e);
        }


        setAuth(null);
        setRefresh(null);
        setUserData(null);
    }


    const value = {
        auth: auth,
        refresh: refresh,
        setAuth: setAuth,
        setRefresh: setRefresh,
        userData: userData,
        setUserData: setUserData,
        logout: logout,
        setChangeData: setChangeData
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}