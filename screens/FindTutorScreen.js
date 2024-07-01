import { View, Text, ActivityIndicator, StyleSheet, TextInput, ScrollView, Button, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { RadioButton } from 'react-native-paper';
import dayjs from 'dayjs'
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome5 } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from 'react-native-ui-datepicker';


export default function FindTutorScreen({ navigation }) {
    const authCtx = useContext(AuthConText);
    const token = authCtx.accessToken;
    const [isNormal, setIsNormal] = useState(true)
    const [isLoading, setLoading] = useState(true)
    const [isCalculateFee, setIscalculateFee] = useState(false)
    const [majorName, setMajorName] = useState('');
    const [majorList, setMajorList] = useState([])
    const [subjectName, setSubjectName] = useState('');
    const [feeNumber, setFeeNumber] = useState(0)
    const [subjectList, setSubjectList] = useState([])
    const [date, setDate] = useState(dayjs(new Date().setDate(new Date().getDate() + 1)).toDate());
    const [lessons, setLessons] = useState(1)
    const [phoneNumber, setPhoneNumber] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [summaryValue, setSummaryValue] = useState('');
    const [open, setOpen] = useState(false);

    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const showDatePicker = () => {
        setOpen(true);
    };

    const hideDatePicker = () => {
        setOpen(false);
    };


    const getListMajors = async () => {
        const response = await axiosAuth.get('/Course?pageNumber=0&pageSize=100')
        setMajorList(response.data.data)
    }

    const getListSubjects = async (id) => {
        setIscalculateFee(true)
        const response = await axiosAuth.get(`/Subject/get-subject-by-courseId/${id}?pageNumber=0&pageSize=30`)
        setSubjectName(response.data.data[0].id)
        setIscalculateFee(false)
        setSubjectList(response.data.data)
    }

    const regexPhoneNumber = (phone) => {
        const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
        return phone.match(regexPhoneNumber) ? true : false;
    }

    const getCourseSubjectId = async () => {
        const response = await axiosAuth.post('/CourseSubject/get-course-subject', {
            courseId: majorName,
            subjectId: subjectName
        })
        return response.data.id

    }

    const getTuitionFees = async () => {
        if (subjectName) {
            const courseSubjectId = await getCourseSubjectId()
            const fee = await axiosAuth.post('/Order/get-total-tuition-fee', {
                courseSubjectId,
                quantity: lessons,
                stateInfo: !isNormal
            })
            setFeeNumber(fee.data.message)
        }
    }

    useEffect(() => {
        setFeeNumber(0)
    }, [majorName])

    console.log('status: ', isNormal);
    const handleSubmitPost = async () => {
        const order = {};
        if (
            majorName &&
            subjectName &&
            descriptionValue.trim() &&
            summaryValue.trim() &&
            phoneNumber &&
            regexPhoneNumber(phoneNumber)
        ) {
            const courseSubjectId = await getCourseSubjectId();
            if (courseSubjectId) {
                order.courseSubjectId = courseSubjectId;
                order.description = descriptionValue.trim();
                order.summary = summaryValue.trim();
                order.quantity = lessons;
                order.study = date instanceof Date ? date : date.toDate();
                order.stateInfo = isNormal;
                order.phone = phoneNumber.trim();
                console.log('ORDER: ', order);
                try {
                    const response = await axiosAuth.post('/Order', {
                        summary: order.summary,
                        courseSubjectId: order.courseSubjectId,
                        stateInfo: order.stateInfo,
                        phone: order.phone,
                        description: order.description,
                        quantity: order.quantity,
                        study: order.study
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    console.log('Order response:', response.data);
                    setSummaryValue('')
                    setPhoneNumber('')
                    setDescriptionValue('')
                    setMajorList([])
                    setSubjectList([])
                    setFeeNumber(0)
                    setIsNormal(true)
                    setLessons(1)
                    alert('Posted successfully');
                    navigation.navigate('Classes');

                } catch (error) {
                    Alert.alert(error.response.data.Message);
                }
            } else {
                alert('Failed to retrieve courseSubjectId');
            }
        } else {
            if (!phoneNumber || !regexPhoneNumber(phoneNumber)) {
                alert('Please enter a valid phone number');
            } else {
                alert('Please fill all fields');
            }
        }
    };



    useEffect(() => {
        getTuitionFees()
    }, [subjectName, lessons, isNormal])

    const handleDateChange = ({ date }) => {
        const currentDate = new Date().getTime()
        const pickedDate = new Date(date.$d).getTime()
        setDate(date)
        if (currentDate > pickedDate) {
            alert('You cannot choose a past date');
            setDate(dayjs(new Date().setDate(new Date().getDate() + 1)))
        }
        hideDatePicker();
    }


    const formatDate = (date) => {
        if (!date) return "YYYY-MM-DD";
        return dayjs(date).format("YYYY-MM-DD");
    };


    const handleMajorChange = (value) => {
        getListSubjects(value);
        setMajorName(value);
    };




    const handleSubjectChange = (value) => {
        setSubjectName(value);

    };

    useEffect(() => {
        getListMajors()
    }, [])


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView style={{ backgroundColor: 'white' }}>
                {/* {isLoading && <ActivityIndicator />} */}
                <View style={styles.container}>
                    <Text style={styles.label}>Summary of tutor request:</Text>
                    <TextInput
                        name="summary"
                        id="summary"
                        style={styles.input}
                        value={summaryValue}
                        multiline={true}
                        numberOfLines={5}
                        onChangeText={(text) => setSummaryValue(text)}
                    />
                    <Text style={styles.label}>Contact Phone:</Text>
                    <TextInput
                        name="phone"
                        id="phone"
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        multiline={true}
                        inputMode="numeric"
                    />
                    <Text style={styles.label}>Describe the tutoring request in detail:</Text>
                    <TextInput
                        id="describe"
                        name="describe"
                        style={styles.input}
                        value={descriptionValue}
                        multiline={true}
                        numberOfLines={5}
                        onChangeText={(text) => setDescriptionValue(text)}
                    />
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.label}>Major</Text>
                        <View style={{ marginBottom: 10 }}>
                            <Dropdown
                                style={styles.dropdown}
                                data={majorList.map(major => ({ label: major.code, value: major.id }))}
                                value={selectedMajor}
                                placeholder="Select Major"
                                labelField="label"
                                valueField="value"
                                maxHeight={300}
                                inputSearchStyle={styles.inputSearchStyle}
                                onChange={item => {
                                    setSelectedMajor(item.value);
                                    handleMajorChange(item.value);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text>
                            {majorName ? 'Subject' : 'Please select major'}
                        </Text>
                        <View style={{ marginTop: 8 }}>
                            <Dropdown
                                style={styles.dropdown}
                                data={subjectList.map(subject => ({ label: subject.code, value: subject.id }))}
                                value={selectedSubject}
                                placeholder={!majorName ? 'Select subject' : subjectList.length > 0 ? subjectList[0].code : ''}
                                labelField="label"
                                valueField="value"
                                maxHeight={300}
                                onChange={item => {
                                    setSelectedSubject(item.value);
                                    handleSubjectChange(item.value);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.label}>Estimated tuition fees:</Text>
                        <View style={{ marginTop: 8 }}>
                            {majorName && subjectName ?
                                <View>
                                    {
                                        isCalculateFee
                                            ?
                                            <ActivityIndicator />
                                            :
                                            <TextInput
                                                name="estimated"
                                                id="estimated"
                                                value={feeNumber.toLocaleString() + ' ' + 'VND'}
                                                style={styles.input}
                                                placeholder="Click button to see fee"
                                                editable={false}
                                            />
                                    }
                                </View>
                                :
                                <View style={{ marginRight: 10 }}>
                                    <Text style={{ fontSize: 16 }}>Please select subject and major</Text>
                                </View>}
                        </View>
                    </View>

                    <View >
                        <Text style={styles.label}>Status:</Text>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                                <RadioButton.Item
                                    label="Normal"
                                    status={isNormal ? 'checked' : 'unchecked'}
                                    onPress={() => setIsNormal(true)}
                                    color="blue"
                                    id="normal"
                                    name="normal"
                                />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton.Item
                                    label='Urgent'
                                    status={!isNormal ? 'checked' : 'unchecked'}
                                    onPress={() => setIsNormal(false)}
                                    color="blue"
                                    id="urgent"
                                    name="urgent"
                                />
                            </View>
                        </View>
                    </View>

                    <View >
                        <Text style={styles.label}>Number of lessons per week:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginRight: 12 }}>
                                <RadioButton.Item
                                    label="1 Session"
                                    value={1}
                                    status={lessons === 1 ? 'checked' : 'unchecked'}
                                    onPress={() => setLessons(1)}
                                    color="blue"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <RadioButton.Item
                                    label="2 Session"
                                    value={2}
                                    status={lessons === 2 ? 'checked' : 'unchecked'}
                                    onPress={() => setLessons(2)}
                                    color="blue"
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <View style={{ flex: 1, marginRight: 12 }}>
                                <RadioButton.Item
                                    label="3 Session"
                                    value={3}
                                    status={lessons === 3 ? 'checked' : 'unchecked'}
                                    onPress={() => setLessons(3)}
                                    color="blue"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <RadioButton.Item
                                    label="4 Session"
                                    value={4}
                                    status={lessons === 4 ? 'checked' : 'unchecked'}
                                    onPress={() => setLessons(4)}
                                    color="blue"
                                />
                            </View>
                        </View>
                    </View>

                    <Text style={styles.label}>Expected date of study:</Text>
                    <View style={{ paddingLeft: 12, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                style={styles.inputDate}
                                editable={false}
                                value={formatDate(date)}
                            />
                            <FontAwesome5 name="calendar-alt" size={24} style={styles.icon} color="black" onPress={showDatePicker} />
                        </View>
                        {open && (
                            <DateTimePicker
                                style={styles.datePicker}
                                mode="single"
                                date={new Date(date)}
                                onChange={handleDateChange}
                                onCancel={hideDatePicker}
                            />
                        )}
                        {/* <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            date={date}
                            onConfirm={handleDateChange}
                            onCancel={hideDatePicker}
                        /> */}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmitPost}>
                            <Text style={styles.buttonText}>Post Request</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 40,
        marginTop: 10
    },
    label: {
        marginTop: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 16
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 8
    },
    avatarContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#8DF0C8',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 15,
        textAlign: 'center'
    },
    containerSnackbar: {
        flex: 1,
        justifyContent: 'space-between',
    },
    inputDate: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 15,
        marginRight: 10,
        width: 150
    },
    icon: {
        marginTop: 8
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#8DF0C8',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 15,
        textAlign: 'center'
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    datePicker: {
        flex: 1
    }
});
