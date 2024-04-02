import axios from '../axios';
import React, {useEffect, useState} from 'react';
import {
  Button,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../redux/action/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../components/useFulCompo/Input';

const {height, width} = Dimensions.get('window');

function Login({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [isLoading, setisLoading] = useState(false);
  const [loginData, setloginData] = useState({
    email_id: '',
    password: '',
  });
  //reload screen on each blur   ------------------>
  useEffect(() => {
    const reloadScreen = navigation.addListener('focus', () => {
      setloginData({email_id: '', password: ''});
    });
    return reloadScreen;
  }, [navigation]);

  const handleLogin = async () => {
    let fcmToken;
    try {
      fcmToken = await AsyncStorage.getItem('aibaFcmToken');
      // console.log(fcmToken);
    } catch (error) {
      console.log(error);
    }
    if (loginData.email_id === '') {
      Alert.alert('', "Email id field can't be empty");
      return;
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!loginData.email_id.match(mailformat)) {
      Alert.alert('', 'Your email id is not a valid email type');
      return;
    }
    if (loginData.password.length < 8) {
      Alert.alert('', 'Your password must be atleast 8 charactor long');
      return;
    }
    setisLoading(true);
    let data = new FormData();
    data.append('email_id', loginData.email_id);
    data.append('password', loginData.password);
    data.append('fcm_token', fcmToken);
    try {
      let loginRes = await axios.post('/auth/vendor_login', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      loginRes = await loginRes.data;

      if (loginRes.status === -2) {
        let validationData = loginRes.validation_array;
        for (let key in validationData) {
          Alert.alert('Please check details', validationData[key]);
          setisLoading(false);
          return;
        }
      } else if (loginRes.status === 0) {
        Alert.alert('Login failed', loginRes?.error);
      } else if (loginRes.status == -1) {
        Alert.alert('Login failed', loginRes?.error);
      } else if (loginRes.status === 1) {

        // get user data and store it to async storage then in redux store
        let userData = await axios.get('/user/profile');
        userData = await userData.data;
        if (userData?.status == 1) {
          dispatch(login(userData.data));
          setisLoading(false);
          AsyncStorage.setItem('aibaPass', loginData.password);
          AsyncStorage.setItem('aibaUser', JSON.stringify(userData.data));
          Alert.alert('Login Successful', 'Welcome to AIBA\n\n' + loginRes.message);

          //navigate to book slot screen
          navigation.popToTop();
          navigation.navigate('Book Slot');
        } else {
          Alert.alert('Login Failed', userData?.error);
        }
      } else {
        Alert.alert('Login failed', loginRes?.error);
        setisLoading(false);
      }
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      console.warn('Error', error);
    }
    setTimeout(() => {
      setisLoading(false);
    }, 10000);
  };
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <Header navigation={navigation} />

      <View
        style={{
          marginHorizontal: width * 0.05,
          height: height * 0.8,
          marginTop: 50,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <View>
          {/* top arrow and login text  */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <MaterialIcons name="arrow-back-ios" size={25} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                marginRight: 25,
              }}>
              <Text style={{fontSize: 20, fontWeight: '700', paddingBottom: 7}}>
                Vendor Login
              </Text>
            </View>
          </View>

          <View>
            <Input
              label="Email Address"
              required
              value={loginData.email_id}
              onChangeText={val => {
                val.toLocaleLowerCase(); //make it lowercase for sake of future
                setloginData(pre => {
                  return {...pre, email_id: val};
                });
              }}
              placeholder="Enter your registered email"
            />

            <Input
              label="Password"
              required
              value={loginData.password}
              onChangeText={val => {
                setloginData(pre => {
                  return {...pre, password: val};
                });
              }}
              placeholder="Enter your password"
              secureTextEntry
            />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgetPass');
              }}>
              <Text
                style={{
                  color: '#FF9330',
                  fontSize: 16,
                  fontWeight: '700',
                  marginTop: 8,
                  marginBottom: 25,
                }}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* login button  */}

            <View
              style={{
                marginTop: 20,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={{
                  backgroundColor: '#FF9330',
                  paddingVertical: 12,
                  paddingHorizontal: 50,
                  borderRadius: 5,
                  width: 175,
                }}>
                {isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    Login
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {/* <Button title="Login" color="#FF9330" onPress={handleLogin} /> */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={{textAlign: 'center'}}>
                Its your first time here?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Vendor Registration');
                }}>
                <Text
                  style={{
                    color: '#FF9330',
                    marginHorizontal: 5,
                    fontWeight: '700',
                  }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={{textAlign: 'center'}}> copyright © AIBA </Text>
      </View>
    </ScrollView>
  );
}

export default Login;
