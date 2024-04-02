import axios from '../axios';
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Input from '../components/useFulCompo/Input';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// user/forgot_password
const {height, width} = Dimensions.get('window');

function ForgetPass({navigation}) {
  const [email, setemail] = useState('');
  const [disableBtn, setdisableBtn] = useState(false);
  const handleSubmit = async () => {
    if (email === '') {
      Alert.alert('', "Email Id Field Cann't be empty.....");
      return;
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      Alert.alert('', 'Your Email Id is not a valid Email Type....');
      return;
    }
    setdisableBtn(true);
    let data = new FormData();
    data.append('email_id', email);
    try {
      let res = await axios.post('/user/forgot_password', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      res = await res.data;
      // console.log(res);
      setdisableBtn(false);
      if (res.status === -2) {
        let validationData = resData.validation_array;
        for (let key in validationData) {
          Alert.alert('Please check details', validationData[key]);
          return;
        }
      }
      if (res.status === 0) {
        Alert.alert('Failed', res.error);
      }
      if (res.status === 1) {
        Alert.alert(
          'Email Sent',
          'Check your email and click on the link sent to your email.',
        );
        navigation.navigate('ForgetPass2');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      {/* <StatusBar backgroundColor="white" barStyle="dark-content" /> */}
      <View style={{height: height, marginHorizontal: width * 0.1}}>
        {/* top navigation start here  */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 50,
          }}>
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
                paddingHorizontal: 20,
              }}>
              <Text style={{fontSize: 20, fontWeight: '700', paddingBottom: 7}}>
                Reset Password
              </Text>
            </View>
          </View>
        </View>
        {/* top navigation ends here  */}
        <View
          style={{
            width: width * 0.8,
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 25,
          }}>
          <Image
            style={{width: 100, height: 100}}
            source={{
              uri: 'https://lh3.googleusercontent.com/-Pb76JbDZpSc/YVFU8d1BDFI/AAAAAAAAAgI/WCuDkXmnu60VWtC2fcLPaHsoEAbXg6kPwCLcBGAsYHQ/mail-box%2B1.png',
            }}
          />
        </View>

        <Text
          style={{
            marginTop: 30,
            fontSize: 17,
            fontWeight: '600',
            color: '#4E4957',
            textAlign: 'center',
          }}>
          Forgot your password?
        </Text>
        <Text
          style={{
            color: '#4E4957',
            textAlign: 'center',
            fontSize: 13,
            marginTop: 15,
          }}>
          Enter your email below to recieve password{'\n'}
          reset instructions
        </Text>

        <Input
          label="Email Address"
          required
          value={email}
          onChangeText={val => {
            setemail(val);
          }}
          placeholder="Enter your registered email"
        />
        <View style={{marginTop: 20}}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#FF9330',
              paddingVertical: 8,
              paddingHorizontal: 50,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: 'white',
                textAlign: 'center',
              }}>
              Send email
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputMainView: {flexDirection: 'row', marginLeft: 20, marginTop: 20},
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderStyle: 'solid',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 2,
    color: '#8f9194',
  },
});

export default ForgetPass;
