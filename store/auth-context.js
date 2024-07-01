import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
export const AuthConText = createContext({
    accessToken: '',
    id: '',
    refreshToken: '',
    isAuthenticated: false,
    authenticate: (token, id) => { },
    logout: () => { }
})

export default function AuthConTextProvider({ children }) {
    const [authToken, setAuthToken] = useState()
    const [id, setId] = useState()


    const authenticate = async (token, id) => {
        setAuthToken(token)
        setId(id)
        await AsyncStorage.setItem('token', token)
        await AsyncStorage.setItem('id', id)
    }

    const logout = () => {
        AsyncStorage.removeItem('token')
        AsyncStorage.removeItem("id")
        setAuthToken(null)
        setId(null)
    }
    const value = {
        accessToken: authToken,
        authenticate,
        logout,
        id: id,
        isAuthenticated: !!authToken || !!id
    }
    return <AuthConText.Provider value={value}>{children}</AuthConText.Provider>
}