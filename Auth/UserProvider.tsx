import Router, { useRouter } from "next/router";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { isAuthenticated } from "./AuthService";

export interface UserAuth {
    username: string;
    password: string;
}
export type UserContextModel = {
    currentUser: UserAuth | undefined,
    setCurrentUser: React.Dispatch<React.SetStateAction<UserAuth | undefined>>
}
export const UserContext = createContext<UserContextModel>({} as UserContextModel);

type UserProviderProps = {
    children: ReactNode;
}
export const freeRoutes = ['login', 'signup']
export const UserProvider = ({ children }: UserProviderProps) => {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<UserAuth | undefined>(undefined);

    useEffect(() => {
        // const checkLoggedIn = async () => {
        //     let cuser = isAuthenticated();
        //     if (cuser === null) {
        //         localStorage.setItem('user', '');
        //         cuser = '';
        //     } else {
        //         setCurrentUser(cuser);
        //     }

        // };

        // checkLoggedIn();

        if (freeRoutes.includes(window.location.pathname.split('/')[1])) {
            console.log("You are not logged in yet")
        } else {
            const storageUser = localStorage.getItem('user');
            const parsedStorageUser: UserAuth | null = storageUser ? JSON.parse(storageUser) : null;
            if (parsedStorageUser && parsedStorageUser.username) {
                setCurrentUser(parsedStorageUser)
            } else {
                router.push('login')
            }
        }
        console.log('usercontext', currentUser);
    }, []);


    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );

};