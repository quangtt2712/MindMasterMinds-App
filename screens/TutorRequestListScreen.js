import React, { useContext, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';


import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';

export default function TutorRequestListScreen() {
    const [currentPage, setCurrentPage] = useState(1);
    const [listClasses, setListClasses] = useState([]);
    const authCtx = useContext(AuthConText);
    const token = authCtx.accessToken;
    const [refresh, setRefresh] = useState(false);
    console.log(token)



    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(
            undefined,
            options
        );
        return formattedDate;
    };

    const formatPrice = (price) => {
        const formattedPrice = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
        return formattedPrice;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosAuth.get(`/Order?pageNumber=0&pageSize=100`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data.data;
                console.log('user: ', userData);
                setListClasses(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, [refresh]);

    const handleApply = async (id) => {
        try {
            // Assuming axiosAuth.post returns a promise, otherwise, modify accordingly
            const response = await axiosAuth.post(
                '/Order/register-order-by-tutor', id,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }


            );
            console.log(token)

            Alert.alert('Sent apply successful');

            setRefresh((prev) => !prev);
        } catch (error) {
            console.log(error);

            Alert.alert('Apply error', error.response.data.Message);
            console.log(token)
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.container}>
                <View style={styles.card} key={item.id}>
                    <View style={styles.cardBody}>
                        <View style={styles.cardBodyTitle}>
                            <Text style={styles.cardTitle}>{item.courseSubject.subject.code}</Text>
                            <Text style={styles.cardTitle}> - </Text>
                            <Text style={styles.cardTitle}>{item.courseSubject.subject.name}</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <View style={styles.cardRowItem}>
                                <FeatherIcon color="black" name="book" size={13} />
                                <Text style={styles.cardRowItemText}>{item.quantity} sections</Text>
                            </View>

                            <View style={styles.cardRowItem}>
                                <Text style={{ fontSize: 13, color: 'black' }}>Fees:</Text>
                                <Text style={styles.cardRowItemText}>{formatPrice(item.courseSubject.subject.price
                                    * item.quantity)}</Text>
                            </View>
                        </View>
                        <View style={styles.decription}>
                            <View style={styles.cardDate}>
                                <Text style={styles.cardDateTitle}>
                                    Summry:
                                </Text>
                                <Text style={styles.cardDateBody}>
                                    {item.summary}
                                </Text>
                            </View>
                            <View style={styles.cardDate}>
                                <Text style={styles.cardDateTitle}>
                                    Description:
                                </Text>
                                <Text style={styles.cardDateBody}>
                                    {item.description}
                                </Text>
                            </View>

                            <View style={styles.cardDate}>
                                <Text style={styles.cardDateTitle}>
                                    Create At:
                                </Text>
                                <Text style={styles.cardDateBody}>
                                    {formatDate(item.createdAt)}
                                </Text>
                            </View>
                            <View style={styles.cardDate}>
                                <Text style={styles.cardDateTitle}>
                                    Expected date of study:
                                </Text>
                                <Text style={styles.cardDateBody}>
                                    {formatDate(item.study)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={styles.cardFooterText}>
                                Status: {item.stateInfo ? 'Urgent' : 'Normal'}
                            </Text>
                            {!item.checkApply ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#B31312', fontSize: 14, fontWeight: '500', marginRight: 5 }}>Waiting</Text>
                                    <TouchableOpacity onPress={() => handleApply(item.id)} style={styles.cardFooterButton}>
                                        <Text style={{ fontSize: 14, color: 'black', fontWeight: '600', padding: 4 }}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.cardFooterButton}>
                                    <Text style={styles.cardFooterButtonText}>  Applied </Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={listClasses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8
    },
    notorder: {
        fontSize: 20,
        color: '#B4B4B8',
        paddingHorizontal: 40,
        paddingVertical: '50%'
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
        marginBottom: 12,
    },
    /** Card */
    card: {
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: '#e3e3e3',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    cardImg: {
        width: '100%',
        height: 180,
    },
    cardBody: {
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    cardBodyTitle: {
        flexDirection: 'row'
    },
    cardTitle: {

        fontSize: 18,
        lineHeight: 28,
        fontWeight: '700',
        color: 'darkgreen',
        marginBottom: 8,
    },
    cardRow: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginHorizontal: -6,
        marginBottom: 8,
    },
    cardRowItem: {
        marginHorizontal: 7,
        width: '50',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#8ADBB4',
        backgroundColor: '#8ADBB4',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    cardRowItemText: {
        paddingVertical: 5,
        fontSize: 13,
        color: 'black',

        marginLeft: 2,
    },
    cardPrice: {
        marginRight: 6,
        marginBottom: 3,
        fontSize: 15,
        fontWeight: '400',
        color: '#173153',
    },
    cardDate: {
        flexDirection: 'row'
    },
    cardDateTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#173153',
        marginRight: 3

    },
    cardDateBody: {
        fontSize: 15,
        color: '#173153',
        paddingVertical: 2,
    },
    dateicon: {
        marginRight: 4
    },
    decription: {
        marginHorizontal: 12
    },
    cardFooter: {
        marginTop: 5,
        paddingTop: 8,
        borderTopWidth: 1,
        borderColor: '#e9e9e9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardFooterText: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '500',
        color: '#909090',
    },
    cardFooterButton: {
        marginHorizontal: 0,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8ADBB4',
        backgroundColor: '#8ADBB4',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 3,
        paddingVertical: 3,
    },
    cardFooterButtonText: {
        fontSize: 14,
        color: 'black',
        fontWeight: '600',
        padding: 4
    },
});
