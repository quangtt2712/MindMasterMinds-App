import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonLoader from '../components/UI/SkeletonLoading';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment-timezone';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/style';
import useAxiosAuth from '../lib/hooks/useAxiosAuth';
import { Dropdown } from 'react-native-element-dropdown';

export default function ClassesScreen({ navigation }) {
    const authCtx = useContext(AuthConText);
    const token = authCtx.accessToken;
    const id = authCtx.id
    const [isLoading, setIsLoading] = useState(false)
    const [listClasses, setListClasses] = useState([])
    const [isLoadingMore, setIsLoadingMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [refreshing, setRefreshing] = useState(false)
    const [orderStatus, setOrderStatus] = useState('Ordered')
    const [role, setRole] = useState('')
    const axiosAuth = useAxiosAuth()

    useEffect(() => {
        console.log('order status: ', orderStatus);
        fetchData(0, orderStatus)
    }, [orderStatus])

    const fetchData = async (page = 0, orderStatus) => {

        try {

            if (id) {
                const response = await axiosAuth.get(
                    `/User/get-user-detail/${id}`
                );
                const userData = response.data;
                console.log('userdata: ', userData.userRole.roleName);
                const role = userData.userRole.roleName
                setRole(role)
                if (role === 'Tutor') {
                    console.log('zo');
                    setIsLoading(true)
                    const response = await axiosAuth.get(`/Order/get-list-order-by-course-and-status-by-tutor?pageNumber=0&pageSize=100&statusOrder=${orderStatus}`);
                    setIsLoading(false)
                    setListClasses(response.data.data);

                } else if (role === 'Student') {
                    console.log('vào');
                    setIsLoading(true)
                    const response = await axiosAuth.get(`/Order/get-list-order-by-course-and-status-by-me?pageNumber=0&pageSize=100&statusOrder=${orderStatus}`);
                    setIsLoading(false)
                    setListClasses(response.data.data);

                }
            }

        } catch (error) {
            console.error('Error fetching data:', error);

        }
    };
    const renderItem = ({ item }) => {
        return (
            <>
                <View >
                    <View contentContainerStyle={styles.container}>
                        <TouchableOpacity
                            key={item.id}
                        >
                            <View style={styles.card}>

                                <View style={styles.cardBody}>
                                    <Text>
                                        <Text style={styles.cardTitle}>{item.courseSubject.subject.code} - </Text>{' '}
                                        <Text style={styles.cardName}>
                                            {item.courseSubject.subject.name}
                                        </Text>
                                    </Text>
                                    <View style={styles.cardRow}>
                                        <View style={styles.cardRowItem}>
                                            <FontAwesome5 name="calendar-alt" size={24} color="gray" />
                                            <Text style={styles.cardRowItemText}>
                                                {
                                                    moment.utc(item.study).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY')
                                                }
                                            </Text>
                                        </View>

                                        <View style={styles.cardRowItem}>
                                            <FontAwesome5 name="clock" size={24} color="gray" />
                                            <Text style={styles.cardRowItemText}>
                                                {
                                                    item.quantity
                                                } session
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.buttonGroup}>
                                        <Text style={styles.cardPrice}>
                                            <Text style={styles.cardPriceCurrency}>Status: </Text>
                                            <Text style={styles.cardPriceValue}>
                                                {
                                                    item.statusOrder === "Confirmed"
                                                        ? "On Progress"
                                                        : item.statusOrder
                                                }
                                            </Text>
                                        </Text>
                                        {
                                            item.tutor != null &&
                                            role === 'Tutor' &&
                                            item.tutor.id === id &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('DetailClass', { classID: item.id, role: role });
                                                }}>
                                                <View style={styles.btn}>
                                                    <Text style={styles.btnText}>Go to course</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        {
                                            item.tutor != null &&
                                            role === 'Tutor' &&
                                            item.tutor.id !== id &&
                                            <TouchableOpacity>
                                                <View style={[styles.btn, styles.noBackgr]}>
                                                    <Text style={styles.btnText2}>Eliminated</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        {role === 'Student' &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('DetailClass', { classID: item.id, role: role });
                                                }}>
                                                <View style={styles.btn}>
                                                    <Text style={styles.btnText}>Go to course</Text>
                                                </View>
                                            </TouchableOpacity>}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        );
    };


    const renderLoader = () => {
        console.log('render loadder: ', isLoadingMore);
        return isLoadingMore ? <SkeletonLoader /> : null;
    };


    const loadMoreItem = async () => {
        await fetchData(currentPage + 1)
        setCurrentPage(prev => prev + 1);
    };

    const refreshHandler = () => {
        setListClasses([])
        setCurrentPage(0)
        fetchData(0, orderStatus)
    }

    return (
        <>
            <StatusBar backgroundColor="#000" />
            {isLoading && <LoadingOverlay />}
            <View style={{ margin: 10, alignItems: 'flex-end' }}>
                <Dropdown
                    style={styles.dropdown}
                    data={[
                        { label: 'Ordered', value: 'Ordered' },
                        { label: 'Confirmed', value: 'Confirmed' },
                        { label: 'Completed', value: 'Completed' },
                    ]}
                    value={orderStatus}
                    placeholder="Select Status"
                    labelField="label"
                    valueField="value"
                    maxHeight={300}
                    inputSearchStyle={styles.inputSearchStyle}
                    onChange={item => {
                        console.log('change: ', item);
                        setOrderStatus(item.value);
                    }}
                />
            </View>
            {
                listClasses.length === 0 ? <Text
                    style={{ marginTop: 100, fontSize: 25, color: '#ccc', fontWeight: 'bold', textAlign: 'center' }}>You don't have any class</Text>
                    :
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                tintColor={GlobalStyles.colors.backgroundColorPrimary100}
                                refreshing={false}
                                onRefresh={refreshHandler}
                            />}
                        data={listClasses}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    // ListFooterComponent={renderLoader}
                    // onEndReached={loadMoreItem}
                    // onEndReachedThreshold={0}
                    />
            }

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
    },
    /** Card */
    card: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 12,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 4
    },
    noBackgr: {
        backgroundColor: '#fff',
        borderWidth: 0
    },
    btnText2: {
        color: 'red',
        fontWeight: 'bold'
    },
    cardBody: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginRight: 8,
    },
    cardName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#5f697d',

    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 10,
    },
    cardRowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginRight: 20,
        marginTop: 5
    },
    cardRowItemText: {
        marginLeft: 8,
        fontSize: 12,
        fontWeight: '500',
        color: '#5f697d',
    },
    cardPrice: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 10,
        width: 200,
        marginRight: 25
    },
    cardPriceValue: {
        fontSize: 17,
        fontWeight: '700',
        color: '#3e8468',
    },
    cardPriceCurrency: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },

    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#93FDD3',
        borderColor: '#93FDD3',
        minWidth: 110
    },
    btnText: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: 'black',

    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 14
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: '40%',
        backgroundColor: 'white',
        shadowOpacity: 0.1,
        shadowOffset: { width: 1, height: 1 }
    },
});