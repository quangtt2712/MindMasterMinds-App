import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import AuthContent from '../components/Auth/AuthContent'
import { sendOtpToUser } from '../util/auth'
import { useNavigation } from '@react-navigation/native'
import { OtpInput } from '../components/Auth/OTPinputFields'
import LoadingOverlay from '../components/UI/LoadingOverlay'



export default function SignUpScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [isExist, setIsExist] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const signUpHandler = async ({ email, password, lastName, firstName }) => {
        setIsLoading(true)

        try {
            const isSentSuccess = await sendOtpToUser({ email, password, lastName, firstName })
            navigation.navigate('OTP', {
                email: email,
                password: password,
                lastName: lastName,
                firstName: firstName
            })
            setIsExist(true)
        } catch (error) {
            if (error.response.status === 409) {
                Alert.alert('Sign up failed', 'Account has been registered')
            } else {
                Alert.alert(error.response.data)
            }

        }

        setIsLoading(false)

    }
    return (
        <>
            {isLoading && <LoadingOverlay />}
            <View style={styles.outerContainer}>
                <ScrollView automaticallyAdjustKeyboardInsets={true}>
                    {isAuthenticating && <LoadingOverlay message='' />}
                    <View style={styles.innerContainer}>
                        <Image style={styles.image} source={require('../assets/images/logo-app.jpg')} />
                        <Text style={styles.title}>MindMasterMinds</Text>

                    </View>
                    <AuthContent onAuthenticate={signUpHandler} />

                </ScrollView>
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
        flex: 1,
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center'
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