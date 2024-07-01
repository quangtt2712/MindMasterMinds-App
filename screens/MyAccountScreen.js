import React, { useContext, useState, useEffect } from 'react';
import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Linking } from 'react-native';

export default function MyAccountScreen({ navigation }) {
  const isFocused = useIsFocused();
  const getLink = async () => {
    const link = await Linking.getInitialURL()
    console.log('link: ', link);
  }
  getLink()
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthConText);
  const token = authCtx.accessToken;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState('')




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAuth.get(
          `/User/get-user-detail/${authCtx.id}`
        );
        const userData = response.data;
        setUsername(userData.firstName + ' ' + userData.lastName || '');
        setEmail(userData.email || '');
        setAvatar(userData.avatar || null);
        setRole(userData.userRole.roleName)

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [authCtx.id, isFocused]);

  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleLogout = async () => {
    try {
      authCtx.logout();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.content}>
          <View>
            <Text style={styles.sectionTitle}>Account</Text>



            <View style={styles.profile}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Profile');
                }}>
                <View style={styles.profileAvatarWrapper}>
                  {avatar ? (
                    <Image
                      alt=""
                      source={{
                        uri: avatar,
                      }}
                      style={styles.profileAvatar} />
                  ) : (
                    <Image
                      alt=""
                      source={{
                        uri: 'https://static.thenounproject.com/png/642902-200.png',
                      }}
                      style={styles.profileAvatar} />
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Profile');
                    }}>
                    <View style={styles.profileAction}>
                      <FeatherIcon
                        color="#fff"
                        name="edit-3"
                        size={15} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <View>
                <Text style={styles.profileName}>{username}</Text>

                <Text style={styles.profileAddress}>
                  {role}
                </Text>
              </View>
            </View>

          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>

                  <Text style={styles.rowLabel}>Language</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}>English</Text>
                  {/* <FeatherIcon
                        color="#bcbcbc"
                        name="chevron-right"
                        size={19} /> */}
                </TouchableOpacity>
              </View>



              <View style={[styles.rowWrapper, styles.rowLast]}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Location</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}>Ho Chi Minh, VN</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Pricing')
                  }}
                  style={styles.row}>
                  <Text style={styles.rowLabel}>Top Up</Text>

                  <View style={styles.rowSpacer} />

                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </TouchableOpacity>
              </View>
              {role === 'Student' &&
                <View style={styles.rowWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('HistoryOrder')
                    }}
                    style={styles.row}>
                    <Text style={styles.rowLabel}>History Order</Text>

                    <View style={styles.rowSpacer} />

                    <FeatherIcon
                      color="#bcbcbc"
                      name="chevron-right"
                      size={19} />
                  </TouchableOpacity>
                </View>
              }

              {role === 'Tutor' ? (
                <View style={styles.rowWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      // handle onPress
                      navigation.navigate('Request')
                    }}
                    style={styles.row}>
                    <Text style={styles.rowLabel}>Tutor request list</Text>
                    <View style={styles.rowSpacer} />

                    <FeatherIcon
                      color="#bcbcbc"
                      name="chevron-right"
                      size={19} />
                  </TouchableOpacity>
                </View>

              ) : ""}


              <View style={[styles.rowWrapper, styles.rowLast]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <Text style={styles.rowLabel}>Terms and Privacy</Text>

                  <View style={styles.rowSpacer} />

                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionBody}>
              <View
                style={[
                  styles.rowWrapper,
                  styles.rowFirst,
                  styles.rowLast,
                  { alignItems: 'center' },
                ]}>
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.row}>
                  <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                    Log Out
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* <Text style={styles.contentFooter}>App Version 2.24 #50491</Text> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
  },
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#a69f9f',
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderRadius: 12,

  },
  /** Profile */
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: '#989898',
    textAlign: 'center',
  },
  /** Row */
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ababab',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    color: '#dc2626',
  },
});