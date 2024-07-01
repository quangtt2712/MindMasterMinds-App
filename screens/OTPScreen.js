import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { OtpInput } from '../components/Auth/OTPinputFields'
import { GlobalStyles } from '../constants/style'
import Button from '../components/UI/Button'
import axios from '../lib/axios'
import { signUpUser } from '../util/auth'
import { useNavigation } from '@react-navigation/native'
import LoadingOverlay from '../components/UI/LoadingOverlay'

export default function OTPScreen ({ route }) {
    const [otpValues, setOtpValues] = useState('')
    const [disabled, setDisabled] = useState(true)
    const { email, lastName, firstName, password } = route.params
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(false)

    const handleOtplValues = (enteredValue) => {
        setOtpValues(enteredValue)
        if (enteredValue.length === 6) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }

    const handleSubmitOTP = async () => {
        if (otpValues.length < 1) return
        try {
            setIsLoading(true)
            const response = await signUpUser(email, password, firstName, lastName, otpValues)
            navigation.replace('Login')

        } catch (error) {
            Alert.alert('Invalid OTP', 'Wrong OTP Code. Please try again!')
        }
        setIsLoading(false)
    }

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <View style={styles.outerContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Verification</Text>
                    <Text style={styles.detail}>MindMasterMinds sent OTP code to your email</Text>
                </View>
                <View style={styles.innerContainer}>
                    <OtpInput numberOfInputs={6} onChangeText={handleOtplValues.bind(this)} />
                    <Button disabled={disabled} onPress={handleSubmitOTP}>
                        <Text>SUBMIT</Text>
                    </Button>
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
    titleContainer: {
        alignItems: 'center',
        marginTop: 100
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    detail: {

    },
    innerContainer: {
        marginHorizontal: 20,
        flex: 1,
        top: 200
    },
    button: {
        marginTop: 20
    }
})