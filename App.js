import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from './screens/ExploreScreen';
import { Ionicons, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons'
import FindTutorScreen from './screens/FindTutorScreen';
import ClassesScreen from './screens/ClassesScreen';
import ListTutorsScreen from './screens/ListTutorsScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import { GlobalStyles } from './constants/style'
import AuthConTextProvider, { AuthConText } from './store/auth-context';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import { useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailClassScreen from './screens/DetailClassScreen';
import HistoryOrderScreen from './screens/HistoryOrderScreen';
import PricingScreen from './screens/PricingScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import OTPScreen from './screens/OTPScreen'
import LandingScreen from './screens/LandingScreen';
import TutorRequestListScreen from './screens/TutorRequestListScreen';
import useAxiosAuth from './lib/hooks/useAxiosAuth';


const Stack = createNativeStackNavigator()
const Bottoms = createBottomTabNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login" component={LoginScreen} />
      <Stack.Screen
        options={{
          headerShown: false
        }}
        name="Signup"
        component={SignUpScreen}
      />
      <Stack.Screen
        name='OTP'
        options={{
          headerShown: false
        }}
        component={OTPScreen}
      />
    </Stack.Navigator>
  );
}

const getUserId = async () => {
  const authCtx = useContext(AuthConText)
  const axiosAuth = useAxiosAuth()
  const id = authCtx.id
  const response = await axiosAuth.get(
    `/User/get-user-detail/${id}`
  );
  const userData = response.data;
  const role = userData.userRole.roleName
  return role
}

const BottomTabs = () => {

  return (
    <Bottoms.Navigator
      screenOptions={{
        tabBarActiveTintColor: GlobalStyles.colors.backgroundColorPrimary200,
      }}>

      <Bottoms.Screen
        name='FindTutor'
        component={FindTutorScreen}
        options={{
          unmountOnBlur: true,
          title: 'Find Tutor',
          tabBarLabel: 'Find Tutor',
          tabBarLabelStyle: {
            fontSize: 13
          },
          tabBarIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />
        }}
      />
      <Bottoms.Screen
        name='Classes'
        component={ClassesScreen}
        options={{
          unmountOnBlur: true,
          title: 'Classes',
          tabBarLabel: 'Classes',
          tabBarLabelStyle: {
            fontSize: 13,
          },
          tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="google-classroom" size={size} color={color} />
        }}
      />
      {/* <Bottoms.Screen
        name='ListTutors'
        component={ListTutorsScreen}
        options={{
          title: 'List Tutors',
          tabBarLabel: 'List Tutors',
          tabBarLabelStyle: {
            fontSize: 13
          },
          tabBarIcon: ({ size, color }) => <Entypo name="list" size={size} color={color} />
        }}
      /> */}

      <Bottoms.Screen
        name='MyAccount'
        component={MyAccountScreen}
        options={{
          title: 'My Account',
          tabBarLabel: 'Me',
          tabBarIcon: ({ size, color }) => <AntDesign name="user" size={size} color={color} />
        }}
      />


    </Bottoms.Navigator>
  )
}

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator>
      {/* bottom tabs */}
      <Stack.Screen
        name='Landing'
        component={LandingScreen}
        options={{
          headerShown: false,
          title: ''
        }}
      />
      <Stack.Screen
        name='BottomTabs'
        component={BottomTabs}
        options={{
          headerShown: false,
          title: ''
        }}
      />
      <Stack.Screen
        name='Profile'
        component={EditProfileScreen}
        options={{
          presentation: 'modal'
        }}
      />

      <Stack.Screen
        name='Pricing'
        component={PricingScreen}
        options={{
          title: 'Pricing',
          headerShown: false
        }}
      />
      <Stack.Screen
        name='Request'
        component={TutorRequestListScreen}
        options={{
          title: 'Request',
        }}
      />
      <Stack.Screen
        name='HistoryOrder'
        component={HistoryOrderScreen}
        options={{
          title: 'History Order',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name='DetailClass'
        component={DetailClassScreen}
        options={{
          title: 'Class',
          presentation: 'modal'
        }}
      />

    </Stack.Navigator>
  )
}


function Navigation() {
  const authCtx = useContext(AuthConText)
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

const Root = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const authCtx = useContext(AuthConText)

  useEffect(() => {
    async function prepare() {
      const fetchToken = async () => {
        const storedToken = await AsyncStorage.getItem('token')
        const id = await AsyncStorage.getItem('id')
        if (storedToken) {
          authCtx.authenticate(storedToken, id)
        }
        setAppIsReady(false)
      }
      try {
        fetchToken()
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  if (!appIsReady) {
    return null
  }
  return <Navigation onLayout={onLayoutRootView} />
}




export default function App() {
  return (
    <>
      <StatusBar style='dark' />
      <AuthConTextProvider>
        <Root />
      </AuthConTextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
