
import axios from '../lib/axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUser(email, password) {
    const response = await axios.post('/Auth/login', {
        email: email,
        password: password
    })
    const token = response.data.accessToken
    const userID = response.data.userViewLogin.id;
    console.log(userID)



    return { token, userID }

}

export async function sendOtpToUser({ email, password, firstName, lastName }) {
    if (email && password && firstName && lastName) {
        const response = await axios.post('/User/send-OTP-email', email)
        return response.status
    }
}

export async function signUpUser(email, password, firstName, lastName, otp) {
    const response = await axios.post('/User/register-student', {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        otpEmailCode: otp
    })
    return response
}