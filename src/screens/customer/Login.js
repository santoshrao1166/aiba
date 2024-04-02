import axios from '../../axios';
import React, {useEffect, useState} from 'react';
import {
  Button,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../redux/action/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../../components/useFulCompo/Input';
import {CommonActions, useNavigation} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');

function Login() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(state => state.user);
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
    let data = new FormData();
    data.append('email_id', loginData.email_id);
    data.append('password', loginData.password);
    // axiosPost()
    try {
      let loginRes = await axios.post('auth/customer_login', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      loginRes = await loginRes.data;
      if (loginRes.status === -2) {
        let validationData = loginRes.validation_array;
        for (let key in validationData) {
          Alert.alert('Please check details', validationData[key]);
          return;
        }
      }
      if (loginRes.status === 0) {
        Alert.alert('Login failed', loginRes.error);
      }
      if (loginRes.status == -1) {
        Alert.alert('Login failed', loginRes.error);
      }
      if (loginRes.status === 1) {
        // get user data and store it to async storage then in redux store
        let userData = await axios.get('/user/profile');
        userData = await userData.data;

        if (userData?.status == 1) {
          userData = {...userData?.data, profile_type: userData?.profile_type};
          console.log(userData);
          Alert.alert('Login Successful', 'Welcome to AIBA');
          AsyncStorage.setItem('aibaPass', loginData.password);
          AsyncStorage.setItem('aibaUser', JSON.stringify(userData));
          dispatch(login(userData));
          //navigate to book slot screen
          navigation.navigate('Home');
        } else {
          Alert.alert('Login Failed', loginRes?.error || userData?.error);
        }
      }
    } catch (error) {
      console.warn('Error', error);
    }
  };
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      {/* <StatusBar backgroundColor="white" barStyle="dark-content" /> */}

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
              <View
                style={{
                  marginLeft: 20,
                }}>
                <Text
                  style={{fontSize: 25, fontWeight: '700', paddingBottom: 7}}>
                  Customer Login
                </Text>
              </View>
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
                style={{
                  backgroundColor: '#FF9330',
                  paddingVertical: 12,
                  paddingHorizontal: 50,
                  borderRadius: 5,
                  width: 175,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>

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
                  navigation.navigate('Customer Signup');
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
