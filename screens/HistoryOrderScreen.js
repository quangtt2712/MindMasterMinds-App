import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';

export default function HistoryOrderScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const authCtx = useContext(AuthConText);
    const token = authCtx.accessToken;
    const id = authCtx.id
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    const formatPrice = (price) => {
        const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        return formattedPrice;
    };

    const [classes, setClasses] = useState([]);
    console.log(token);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosAuth.get(`/Order/get-list-order-by-course-and-status-by-me?statusOrder=Completed&pageNumber=0&pageSize=100`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const userData = response.data.data;
                console.log("user: ", response.data.data);
                setClasses(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, []);

    const renderItem = ({ item }) => (
        <View>
            <View style={styles.card}>
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{item.courseSubject.subject.name}</Text>

                    <View style={styles.cardRow}>
                        <View style={styles.cardRowItem}>
                            <FeatherIcon color="black" name="book" size={13} />
                            <Text style={styles.cardRowItemText}>{item.quantity} sections</Text>
                        </View>

                        <View style={styles.cardRowItem}>
                            <FeatherIcon color="black" name="credit-card" size={13} />
                            <Text style={styles.cardRowItemText}>{formatPrice(item.totalPrice)}</Text>
                        </View>
                    </View>
                    <View style={styles.decription}>
                        <View style={styles.cardDate}>
                            <Text style={styles.cardDateTitle}>
                                Tutor:
                            </Text>
                            <Text style={styles.cardDateBody}>
                                {item.tutor.firstName + " " + item.tutor.lastName}
                            </Text>
                        </View>
                        <View style={styles.cardDate}>
                            <Text style={styles.cardDateTitle}>
                                Order Date:
                            </Text>
                            <Text style={styles.cardDateBody}>
                                {formatDate(item.createdAt)}
                            </Text>
                        </View>
                        <View style={styles.cardDate}>
                            <Text style={styles.cardDateTitle}>
                                Study Date:
                            </Text>
                            <Text style={styles.cardDateBody}>
                                {formatDate(item.study)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {classes.length === 0 ? (
                <Text style={styles.notorder}>You haven't placed any orders yet.</Text>
            ) : (
                <FlatList
                    data={classes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5
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
        marginBottom: 10,
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
    cardTitle: {

        fontSize: 21,
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
        padding: 5,
        fontSize: 13,
        color: 'black',

        marginLeft: 4,
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
    }
});
