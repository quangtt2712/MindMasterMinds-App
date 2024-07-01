import React, { useContext, useState } from 'react'
import { AuthConText } from '../store/auth-context'
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import AuthContent from '../components/Auth/AuthContent'
import LoadingOverlay from '../components/UI/LoadingOverlay'
import { getUser } from '../util/auth'

export default function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const authCtx = useContext(AuthConText)

    const signInHandler = async ({ email, password }) => {
        setIsAuthenticating(true)
        try {
            const { token, userID } = await getUser(email, password)
            console.log('token: ', token);
            console.log('id: ', userID);
            authCtx.authenticate(token, userID)
        } catch (error) {
            Alert.alert("Login Failed!", 'Could not log you in. Please check again!')
            setIsAuthenticating(false)
        }
    }
    return (
        <>

            <View style={styles.outerContainer}>
                {isAuthenticating && <LoadingOverlay message='' />}
                <View style={styles.innerContainer}>
                    <Image style={styles.image} source={require('../assets/images/logo-app.jpg')} />
                    <Text style={styles.title}>MindMasterMinds</Text>
                    <AuthContent isLogin onAuthenticate={signInHandler} />
                </View>

            </View>

        </>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: 'white',

    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: 100
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    title: {
        fontSize: 25,
        marginVertical: 15,
        fontWeight: 'bold'
    }
})