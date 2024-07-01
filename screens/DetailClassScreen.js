import { View, Text, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { Feather } from '@expo/vector-icons';
import moment from 'moment-timezone'
import { Ionicons } from '@expo/vector-icons';
import SkeletonLoader from '../components/UI/SkeletonLoading';

export default function DetailClassScreen({ navigation, route }) {
    const { classID, role } = route.params;
    const authCtx = useContext(AuthConText);
    const token = authCtx.accessToken;

    const [listTutors, setListTutors] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [content, setContent] = useState()
    const [isOrdered, setIsOrdered] = useState(true)
    const [loadingContent, setLoadingContent] = useState(true)
    const [isLoadingListTutors, setIsLoadingListTutors] = useState(true)
    const getListTutors = async () => {
        setLoadingContent(true)
        setIsLoadingListTutors(true)
        const response = await axiosAuth
            .get(`/Order/get-list-tutor-resign-order-by-me?orderId=${classID}&pageNumber=0&pageSize=19`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

        const content = await getAContentClassByStudent()
        content.statusOrder === 'Ordered' ? setIsOrdered(true) : setIsOrdered(false)
        setIsLoadingListTutors(false)
        setListTutors(response.data.data)
        setContent(content)
        setLoadingContent(false)
    }

    const getAContentClassByStudent = async () => {
        const response = await axiosAuth.get(`/Order/get-order-detail-by-student?orderId=${classID}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return response.data

    }

    const getAContentClassByTutor = async () => {
        setIsLoadingListTutors(true)
        setLoadingContent(true)
        const response = await axiosAuth.get(`/Order/get-order-detail-by-tutor?orderId=${classID}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        setContent(response.data)
        setIsLoadingListTutors(false)
        setLoadingContent(false)
    }
    useEffect(() => {
        if (role === 'Student') {
            getListTutors()
        }
        if (role === 'Tutor') {
            getAContentClassByTutor()
        }
    }, [classID, refresh])

    const handleApproveTutor = async (tutorId) => {
        try {
            const response = await axiosAuth.post('/Order/confirm-tutor-for-order-by-me', {
                tutorId: tutorId,
                orderId: classID
            })
            alert('Approve successfully!')
            setRefresh((prev) => !prev)

        } catch (error) {
            alert('Approve failed!')
        }
    }

    const handleComplete = async (id) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to proceed?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel', // Optional: You can customize the button style
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        // Handle the confirmation logic here
                        console.log('User confirmed!');
                        try {
                            const response = await axiosAuth.post('/Order/complete-order', id)
                            setRefresh((prev) => !prev)
                            console.log('success')
                        } catch (error) {
                            Alert.alert('Complete failed', error.response.data.Message)
                        }
                    },
                },
            ],
            { cancelable: true } // Optional: Allow tapping outside the alert to dismiss
        );


    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            {loadingContent ?
                <SkeletonLoader /> :
                <ScrollView contentContainerStyle={styles.container}>
                    {
                        isLoadingListTutors ?
                            <View>
                                <SkeletonLoader />
                            </View> :
                            <>
                                {role === 'Tutor' &&
                                    <>
                                        <Text style={styles.title}>Your Student</Text>

                                        <TouchableOpacity
                                            onPress={() => {
                                                // handle onPress
                                            }}>
                                            <View style={styles.card}>
                                                {
                                                    content.student.avatar ?

                                                        <Image
                                                            alt=""
                                                            resizeMode="cover"
                                                            source={{ uri: content.student.avatar }}
                                                            style={styles.cardImg} />
                                                        :
                                                        <Image
                                                            alt=""
                                                            resizeMode="cover"
                                                            source={{ uri: 'https://freepngimg.com/thumb/youtube/62644-profile-account-google-icons-computer-user-iconfinder.png' }}
                                                            style={styles.cardImg} />
                                                }
                                                <View style={styles.cardBody}>
                                                    <Text style={styles.cardTag}>{content.student.userRole.roleName}</Text>

                                                    <Text style={styles.cardTitle}>{content.student.firstName + ' ' + content.student.lastName}</Text>

                                                    <View style={styles.cardRow}>
                                                        <View style={styles.cardRowItem}>
                                                            <View style={{ marginRight: 4 }}>
                                                                <Ionicons name="mail-outline" size={18} color="#939393" />
                                                            </View>
                                                            <Text style={styles.cardRowItemText}>{content.student.email}</Text>
                                                        </View>


                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                }
                                {
                                    role === 'Student' &&
                                    <>
                                        <View style={{ flex: 1 }}>
                                            <StatusBar barStyle="dark-content" />
                                            <Text style={styles.title}>
                                                {isOrdered ? 'Tutor application list' : 'Your tutor'}
                                            </Text>
                                            {
                                                listTutors.length === 0 ?
                                                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                                        <Text style={{ textAlign: 'center' }}>
                                                            There is no application list yet
                                                        </Text>
                                                    </View>
                                                    :
                                                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                                        {
                                                            isOrdered ? listTutors.map(
                                                                tutor =>
                                                                    <TouchableOpacity
                                                                        key={tutor.id}
                                                                        onPress={() => {
                                                                            // handle onPress
                                                                        }}>
                                                                        <View style={styles.card}>
                                                                            {tutor.avatar ?
                                                                                <Image
                                                                                    alt=""
                                                                                    resizeMode="cover"
                                                                                    source={{ uri: tutor.avatar }}
                                                                                    style={styles.cardImg} />
                                                                                :
                                                                                <Image
                                                                                    alt=""
                                                                                    resizeMode="cover"
                                                                                    source={{ uri: 'https://freepngimg.com/thumb/youtube/62644-profile-account-google-icons-computer-user-iconfinder.png' }}
                                                                                    style={styles.cardImg} />
                                                                            }
                                                                            <View style={styles.cardBody}>
                                                                                <Text style={styles.cardTag}> {tutor.userRole.roleName}</Text>

                                                                                <Text style={styles.cardTitle}>{tutor.firstName + ' ' + tutor.lastName}</Text>

                                                                                <View style={styles.cardRow}>
                                                                                    <View style={styles.cardRowItem}>

                                                                                        <View style={{ marginRight: 4 }}>
                                                                                            <Ionicons name="mail-outline" size={18} color="#939393" />

                                                                                        </View>
                                                                                        <Text style={styles.cardRowItemText}>{tutor.email}</Text>

                                                                                    </View>
                                                                                    {
                                                                                        isOrdered ?
                                                                                            <TouchableOpacity
                                                                                                onPress={() => {
                                                                                                    handleApproveTutor(tutor.id)
                                                                                                }}>
                                                                                                <View style={styles.btn}>
                                                                                                    <Text style={styles.btnText}>Approve</Text>
                                                                                                </View>
                                                                                            </TouchableOpacity>
                                                                                            : ""
                                                                                    }

                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                            ) : <>
                                                                <TouchableOpacity
                                                                    key={content.tutor.id}
                                                                    onPress={() => {
                                                                        // handle onPress
                                                                    }}>
                                                                    <View style={styles.card}>
                                                                        {content.tutor.avatar ?
                                                                            <Image
                                                                                alt=""
                                                                                resizeMode="cover"
                                                                                source={{ uri: content.tutor.avatar }}
                                                                                style={styles.cardImg} />
                                                                            :
                                                                            <Image
                                                                                alt=""
                                                                                resizeMode="cover"
                                                                                source={{ uri: 'https://freepngimg.com/thumb/youtube/62644-profile-account-google-icons-computer-user-iconfinder.png' }}
                                                                                style={styles.cardImg} />
                                                                        }
                                                                        <View style={styles.cardBody}>
                                                                            <Text style={styles.cardTag}> {content.tutor.userRole.roleName}</Text>

                                                                            <Text style={styles.cardTitle}>{content.tutor.firstName + ' ' + content.tutor.lastName}</Text>

                                                                            <View style={styles.cardRow}>
                                                                                <View style={styles.cardRowItem}>

                                                                                    <View style={{ marginRight: 4 }}>
                                                                                        <Ionicons name="mail-outline" size={18} color="#939393" />

                                                                                    </View>
                                                                                    <Text style={styles.cardRowItemText}>{content.tutor.email}</Text>

                                                                                </View>

                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                {console.log('content: ', content.tutor)}
                                                            </>
                                                        }
                                                    </View>
                                            }
                                        </View>
                                    </>
                                }

                            </>
                    }


                    {/* Detail content */}
                    <View style={{ flex: 1, marginTop: 25 }}>
                        <StatusBar barStyle="dark-content" />

                        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                            <View>
                                <View style={styles.header}>
                                    <Text style={styles.headerTitle}>Detail class</Text>
                                </View>

                                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>


                                    <TouchableOpacity
                                        onPress={() => {
                                            // handle onPress
                                        }}
                                        style={styles.picker}>
                                        <Feather color="#000" name="calendar" size={18} />

                                        <View style={styles.pickerDates}>
                                            <Text style={[styles.pickerDatesText, { marginBottom: 2 }]}>
                                                Create at: {moment.utc(content?.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY')}

                                            </Text>
                                        </View>


                                    </TouchableOpacity>
                                    <View style={styles.picker}>
                                        <Feather color="#000" name="calendar" size={18} />

                                        <View style={styles.pickerDates}>

                                            <Text style={[styles.pickerDatesText, { marginBottom: 2 }]}>
                                                Start at: {moment.utc(content?.study).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY')}
                                            </Text>

                                        </View>


                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoTitle}>Summary</Text>



                                        <Text style={styles.infoDescription}>
                                            {content?.summary}
                                        </Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoTitle}>Description</Text>


                                        <Text style={styles.infoDescription}>
                                            {content?.description}
                                        </Text>
                                    </View>
                                    <View style={styles.stats}>

                                        <View style={styles.stats}>
                                            {/* First row */}
                                            <View style={[styles.statsRow, { borderTopWidth: 0 }]}>
                                                {/* First item */}
                                                <View style={[styles.statsItem, { borderLeftWidth: 0 }]}>
                                                    <Text style={styles.statsItemText}>Major</Text>
                                                    <Text style={styles.statsItemValue}>{content?.courseSubject.course.name}</Text>
                                                </View>
                                                {/* Second item */}
                                                <View style={styles.statsItem}>
                                                    <Text style={styles.statsItemText}>Session</Text>
                                                    <Text style={styles.statsItemValue}>{content?.quantity}</Text>
                                                </View>
                                            </View>

                                            {/* Second row */}
                                            <View style={styles.statsRow}>
                                                <View style={[styles.statsItem, { borderLeftWidth: 0 }]}>
                                                    <Text style={styles.statsItemText}>Class Fees</Text>
                                                    <Text style={styles.statsItemValue}>{content?.totalPrice}</Text>
                                                </View>
                                                <View style={styles.statsItem}>
                                                    <Text style={styles.statsItemText}>Class Type</Text>
                                                    <Text style={styles.statsItemValue}>{content?.stateInfo ? 'Urgent' : 'Normal'}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.statsRow}>
                                                <View style={[styles.statsItem, { borderLeftWidth: 0 }]}>
                                                    <Text style={styles.statsItemText}>Student</Text>
                                                    <Text style={styles.statsItemValue}>{content?.student.firstName + ' ' + content?.student.lastName}</Text>
                                                </View>
                                                <View style={styles.statsItem}>
                                                    <Text style={styles.statsItemText}>Status</Text>
                                                    <Text style={styles.statsItemValue}>{content?.statusOrder === 'Confirmed' ? 'On Progress' : content?.statusOrder}</Text>
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{ marginTop: 20 }}>
                                        {
                                            content?.statusOrder === 'Confirmed' && role === 'Tutor'
                                            && <TouchableOpacity
                                                onPress={() => handleComplete(content.id)}
                                            >
                                                <View style={styles.btn}>
                                                    <Text style={styles.btnText}>Complete</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        {
                                            content?.statusOrder === 'Completed' && role === 'Tutor'
                                            && <TouchableOpacity
                                            >
                                                <View style={[styles.btn, { backgroundColor: 'red' }]}>
                                                    <Text style={{ color: 'white' }}>Completed</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </ScrollView>
                            </View>
                        </SafeAreaView>


                    </View>
                </ScrollView >
            }
        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
    },

    title: {
        fontSize: 25,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 14,
        textAlign: 'center'
    },
    gridTutors: {
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 3,
        maxHeight: '50vh',
        overflow: 'auto',
        padding: 20,
        marginBottom: 30,
    },
    /** Card */
    card: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    cardImg: {
        width: 96,
        height: 96,
        borderRadius: 12,
    },
    cardBody: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
    },
    cardTag: {
        fontWeight: '500',
        fontSize: 15,
        color: '#939393',
        marginBottom: 10,
        marginTop: 10,
        textTransform: 'capitalize',
    },
    cardTitle: {
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 19,
        color: '#000',
        marginBottom: 11,
    },
    cardRow: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginHorizontal: -8,
        marginBottom: 'auto',
    },
    cardRowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        borderRightWidth: 1,
        borderColor: 'transparent',
    },
    cardRowItemImg: {
        width: 22,
        height: 22,
        borderRadius: 9999,
        marginRight: 6,
    },
    cardRowItemText: {
        fontWeight: '400',
        fontSize: 13,
        color: '#939393',
    },
    cardRowDivider: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#939393',
    },

    /** Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerAction: {
        width: 40,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center'
    },
    /** Picker */
    picker: {
        marginTop: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left',
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#f5f5f5',
    },
    pickerDates: {
        marginLeft: 12,
    },
    pickerDatesText: {
        fontSize: 14,
        fontWeight: '500',
    },
    /** Info */
    info: {
        marginTop: 12,
        backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f5f5f5',
    },
    infoTitle: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '600',
        letterSpacing: 0.38,
        color: '#000000',
        marginBottom: 6,
    },
    infoDescription: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: -0.078,
        color: '#8e8e93',
    },
    /** Stats */
    stats: {
        marginTop: 12,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderColor: '#fff',
    },
    statsItem: {
        flexGrow: 2,
        flexShrink: 1,
        flexBasis: 0,
        paddingVertical: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderColor: '#fff',
    },
    statsItemText: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 18,
        color: 'black',
        marginBottom: 4,
    },
    statsItemValue: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: '#8e8e93',
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        backgroundColor: '#93FDD3',
        borderColor: '#93FDD3',
    },
    btnText: {
        fontSize: 15,
        lineHeight: 18,
        fontWeight: '600',
        color: 'black',

    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 14
    }
});