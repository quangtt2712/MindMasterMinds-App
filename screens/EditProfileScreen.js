import React, { useContext, useEffect, useState } from 'react'
import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import * as ImagePicker from 'expo-image-picker';
import { Snackbar } from 'react-native-paper';

export default function EditProfileScreen({ navigation }) {
  const authCtx = useContext(AuthConText);
  const token = authCtx.accessToken;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumError, setPhoneNumError] = useState('');
  const [balance, setBalance] = useState('')
  const [emailError, setEmailError] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosAuth.get(`/User/get-user-detail/${authCtx.id}`);
      const userData = response.data;
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setPhoneNum(userData.phoneNumber || '');
      setEmail(userData.email || '');
      setAvatarURL(userData.avatar || null);
      setBalance(userData.wallet.balance);
      console.log("authCtx.id", authCtx.id)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setAvatar({ uri: result.assets[0].uri });
      setAvatarURL(null);
    }
  };



  const handleChange = (name, value) => {
    if (name === 'firstName') {
      setFirstName(value);
    } else if (name === 'lastName') {
      setLastName(value);
    }
    // else if (name === 'phoneNum') {
    //   setPhoneNum(value);
    //   if (value && !value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
    //     setPhoneNumError('Phone number must have 10 digits and start with 0.');
    //   } else {
    //     setPhoneNumError('');
    //   }
    // } 

    else if (name === 'email') {
      setEmail(value);
      if (value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setEmailError('Please enter a valid email.');
      } else {
        setEmailError('');
      }
    }
  };


  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (firstName) formData.append('firstName', firstName);
      if (lastName) formData.append('lastName', lastName);
      // if (phoneNum) formData.append('phoneNum', phoneNum);
      if (email) formData.append('email', email);
      if (selectedImage) {
        formData.append('avatar', {
          uri: selectedImage,
          name: 'avatar.jpg',
          type: 'image/jpg',
        });
      }

      const response = await axiosAuth.put('/User/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('Profile updated successfully');
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      {isLoading && <LoadingOverlay message='' />}
      <View style={styles.container}>

        <View style={styles.avatarContainer}>
          {selectedImage ? (
            <Image key={selectedImage} style={styles.avatar} source={{ uri: selectedImage }} />
          ) : avatarURL ? (
            <Image style={styles.avatar} source={{ uri: avatarURL }} />
          ) : (
            <Image
              style={styles.avatar}
              source={{ uri: 'https://static.thenounproject.com/png/642902-200.png' }}
            />
          )}
          <TouchableOpacity style={styles.changeAvatarButton} onPress={pickImage}>
            <Text style={styles.changeAvatarButtonText}>Choose from Library</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.changeAvatarButton} onPress={handleChooseCameraImage}>
            <Text style={styles.changeAvatarButtonText}>Take Photo</Text>
          </TouchableOpacity> */}
        </View>

        <Text style={styles.label}>First name</Text>
        <TextInput
          name="firstName"
          style={styles.input}
          onChangeText={(value) => handleChange('firstName', value)}
          value={firstName}
        />
        <Text style={styles.label}>Last name</Text>
        <TextInput
          name="lastName"
          style={styles.input}
          onChangeText={(value) => handleChange('lastName', value)}
          value={lastName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          name="email"
          style={styles.input}
          editable={false}
          onChangeText={(value) => handleChange('email', value)}
          value={email}
        />
        {emailError && <Text style={{ color: '#ff0000', fontSize: 12, textAlign: 'left', marginTop: 3 }}>{emailError}</Text>
        }

        <Text style={styles.label}>Balance: </Text>
        <TextInput
          name="balance"
          style={styles.input}
          value={balance.toLocaleString() + 'VND'}
          editable={false}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerSnackbar}>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={1000}
          >
            {/* Updated profile successfully! */}
            <Text style={{ color: 'white', textAlign: 'center' }}>{snackbarMessage}</Text>
          </Snackbar>
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
  },
  changeAvatarButtonText: {
    marginTop: 10,
    color: '#007bff'
  },
  label: {
    marginTop: 20,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
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
});
