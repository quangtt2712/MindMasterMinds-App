import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AuthForm from './AuthForm'
import { GlobalStyles } from '../../constants/style'
import FlatButton from '../UI/FlatButton'
export default function AuthContent({ isLogin, onAuthenticate }) {
    const navigation = useNavigation()
    const [credentialsInvalid, setCredentialsInvalid] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        lastName: false,
        firstName: false
    })

    const switchAuthModeHandler = () => {
        if (isLogin) {
            navigation.replace('Signup')
        } else {
            navigation.replace('Login')
        }
    }
    const submitHandler = (credentials) => {
        let { email, password, confirmPassword, firstName, lastName } = credentials;

        email = email.trim();
        password = password.trim();
        firstName = firstName.trim();
        lastName = lastName.trim();

        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 8;
        const passwordsAreEqual = password === confirmPassword;
        const firstNameIsValid = firstName.length > 0
        const lastNameIsValid = lastName.length > 0
        if (
            !emailIsValid ||
            !passwordIsValid ||
            (!isLogin && (!passwordsAreEqual || !firstNameIsValid || !lastNameIsValid))
        ) {
            Alert.alert('Invalid input', 'Please check your entered value.');
            setCredentialsInvalid({
                email: !emailIsValid,
                password: !passwordIsValid,
                confirmPassword: !passwordIsValid || !passwordsAreEqual,
                firstName: !firstNameIsValid,
                lastName: !lastNameIsValid
            });
            return;
        }
        if (isLogin) {
            onAuthenticate({ email, password });
        } else {
            onAuthenticate({ email, password, lastName, firstName })
        }
    }
    return (
        <View style={styles.authContent}>
            <AuthForm
                isLogin={isLogin}
                onSubmit={submitHandler}
                credentialsInvalid={credentialsInvalid}
            />
            <View style={styles.buttons}>
                <FlatButton onPress={switchAuthModeHandler}>
                    {isLogin ? 'Dont have an account? Get started for free' : 'Already have an account? Sign in here'}
                </FlatButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    authContent: {
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 8,
        flex: 1
    },
    buttons: {
        marginTop: 30,
    },
});