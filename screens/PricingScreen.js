import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  AppState,
  SafeAreaView,
  Button
} from 'react-native';
import { axiosAuth } from '../lib/axios';
import useAxiosAuth from '../lib/hooks/useAxiosAuth';
import WebView from 'react-native-webview';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { useNavigation } from '@react-navigation/native';

const packageItem = [
  { id: 1, name: 'Fistful of Gems', price: 25000, value: 200, image: "https://i.pinimg.com/564x/a4/d4/57/a4d457d3dff578f6468e1f19ed7b5afd.jpg" },
  { id: 2, name: 'Pile of Gems', price: 129000, value: 1050, image: "https://i.pinimg.com/564x/36/49/da/3649da20302508b6239e00299d189b50.jpg" },
  { id: 3, name: 'Pouch of Gems', price: 249000, value: 2200, image: "https://i.pinimg.com/564x/c0/3a/81/c03a81dc201f5ab1796a450f2b89cc04.jpg" },
  { id: 4, name: 'Bucket of Gems', price: 499000, value: 4600, image: "https://i.pinimg.com/564x/a7/a4/dc/a7a4dc284644cc2d4d939376500d895e.jpg" },
  { id: 5, name: 'Barrel of Gems', price: 1299000, value: 1200, image: "https://i.pinimg.com/564x/0a/a0/12/0aa012157ce9fdeb7f1e368f3e02ff28.jpg" },
  { id: 6, name: 'Wagon of Gems', price: 2499000, value: 25000, image: "https://i.pinimg.com/236x/85/03/d3/8503d3104aaacd1e5f6162ac377951be.jpg" },
];

export default function PricingScreen({ navigation }) {

  const [selectedItem, setSelectedItem] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [sourceUri, setSourceUri] = useState()
  const axiosAuth = useAxiosAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = useState(false)
  const nav = useNavigation()
  const handlePayment = async (value) => {
    setIsLoading(true)
    const response = await axiosAuth.post('/TransactionWallet/deposit/vnpay', {
      'amount': value,
      'redirectUrl': 'https://mind-master-minds-payment-result.vercel.app/'
    })
    setIsLoading(false)
    setSourceUri(response.data.paymentUrl)
    setShow(true)

  };
  console.log('uri: ', sourceUri);
  const injectedJavascript = `(function() {
    window.postMessage = function(data) {
  window.ReactNativeWebView.postMessage(data);
};
})()`
  //   const injectedJavascript = `(function() {
  //     window.postMessage = function(data) {
  //   window.ReactNativeWebView.postMessage(data);
  // };
  // })()`

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        getLink()

      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      getLink()
    });

    return () => {
      subscription.remove();
    };
  }, []);



  return (
    <>
      <SafeAreaView style={styles.safe}>
        <View style={styles.backButton}>
          <Button title='Back' onPress={() => { navigation.navigate('BottomTabs') }} />
        </View>
        {isLoading && <LoadingOverlay />}
        {show &&
          <WebView
            injectedJavaScript={injectedJavascript}
            startInLoadingState
            scalesPageToFit
            style={{ flex: 1 }}
            source={{ uri: sourceUri }}
            javaScriptEnabled
            onMessage={(e) => {
              nav.replace('Pricing')
            }}
            onNavigationStateChange={(navState => {
              console.log('webview navstate: ', navState.vnp_ResponseCode);
              console.log('native url: ', navState.url);
              if (navState.url.includes('vnp_ResponseCode')) {
                // Extract the response code or other relevant information from the URL
                const urlParams = new URLSearchParams(navState.url);
                const responseCode = urlParams.get('vnp_ResponseCode');
                const transactionNo = urlParams.get('vnp_TransactionNo');
                const paymentStatus = responseCode === '00' ? 'Successful' : 'Failed';

                // Handle the payment status accordingly
                console.log(`Payment Status: ${paymentStatus}, Transaction No: ${transactionNo}`);

                // Close the WebView or navigate as needed
              }
            })}
          />
        }
        {!show &&
          <ScrollView style={{ flex: 1, backgroundColor: '#fafafa' }}>

            <View style={styles.container}>
              {/* <Text style={styles.title}>Pick your plan</Text> */}

              {packageItem.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={async () => {
                    setSelectedItem(item);
                    handlePayment(item.price)
                  }}
                >
                  <View style={[styles.radio, selectedItem === item && styles.radioActive]}>
                    <View style={styles.card}>
                      <View style={styles.content}>
                        <Text style={styles.radioLabel}>{item.name}</Text>
                        <Text style={styles.radioPrice}>{item.price.toLocaleString()} VND</Text>
                      </View>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.radioImage}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        }
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  backButton: {
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
  },
  radio: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  radioActive: {
    borderColor: '#0069fe',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: '#b3b3b3',
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  radioPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2f2f2f',
    marginBottom: 12,
  },
  radioImage: {
    width: 100,
    height: 100,
    marginVertical: 5,
    resizeMode: 'cover',
    marginLeft: 8
  },
  safe: {
    flex: 1
  }
});
