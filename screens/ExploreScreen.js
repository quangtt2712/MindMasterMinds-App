import { View, Text, StyleSheet, TextInput, Image, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CreateExploreScreen from './CreateExploreScreen'
import { AuthConText } from '../store/auth-context'
import LoadingOverlay from '../components/UI/LoadingOverlay'
import axios from '../lib/axios'
import { useNavigation } from '@react-navigation/native'

export default function ExploreScreen() {
    const [user, setUser] = useState()
    const [isWaitingUser, setIsWaitingUser] = useState(true)
    const authCtx = useContext(AuthConText)
    const navigation = useNavigation()
    const [content, setContent] = useState()
    const getUserProfile = async () => {
        setIsWaitingUser(true)
        const user = await axios.get('/User/' + authCtx.id)
        console.log(user.data);
        setUser(user.data)
        setIsWaitingUser(false)
    }
    const handleOpenScreen = () => {
        navigation.navigate('CreateExplore')
    }

    useEffect(() => {
        getUserProfile()
    }, [])
    return (
        <>
            <View style={styles.container}>
                {isWaitingUser && <LoadingOverlay />}
                <View style={styles.topContainer}>
                    <View style={styles.imageContainer}>
                        {!isWaitingUser
                            &&
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                        }
                    </View>
                    <Pressable onPress={handleOpenScreen}>
                        <View style={styles.buttonOpenCreateScreen}>
                            <Text style={styles.title}>Share something..</Text>
                        </View>
                    </Pressable>

                </View>

                <View style={styles.bottomContainer}>
                    <Text>Bottom</Text>
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    imageContainer: {

    },
    buttonOpenCreateScreen: {
        marginHorizontal: 20
    },
    title: {
        color: '#000',
        fontSize: 15
    }
})