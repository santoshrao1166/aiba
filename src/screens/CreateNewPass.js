import React, {useState} from 'react';
import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Input from '../components/useFulCompo/Input';

const {height, width} = Dimensions.get('window');

function CreateNewPass({navigation}) {
  const [newPass, setnewPass] = useState({
    password: '',
    confirm_pass: '',
  });
  return (
    <ScrollView
      style={{backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}>
      {/* <StatusBar backgroundColor="white" barStyle="dark-content" /> */}
      {/* top navigation start here  */}
      <View style={{height: height, marginHorizontal: width * 0.1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <View
              style={{
                paddingHorizontal: 20,
              }}>
              <Text style={{fontSize: 25, fontWeight: '700', paddingBottom: 7}}>
                Create new password
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
              uri: 'https://lh3.googleusercontent.com/-kb41Nb3-dqE/YVFU7WZ3f7I/AAAAAAAAAgA/bxSYfUBFU6EO8z6ZXyVUlJDWEH1VWqo_QCLcBGAsYHQ/locked%2B1.png',
            }}
          />
        </View>

        <Text
          style={{
            color: '#4E4957',
            textAlign: 'center',
            fontSize: 13,
            marginTop: 25,
          }}>
          Your password must be diffrent from{'\n'}previous password
        </Text>

        <View>
          <Input
            label="New password"
            required
            value={newPass.password}
            onChangeText={val => {
              setnewPass(pre => {
                return {...pre, password: val};
              });
            }}
            placeholder="Enter new password"
            secureTextEntry
          />

          <Text style={{color: '#787885', marginLeft: 20, marginTop: 5}}>
            Must be atleast 8 characters
          </Text>
        </View>
        <View>
          <Input
            label="Confirm password"
            required
            value={newPass.confirm_pass}
            onChangeText={val => {
              setnewPass(pre => {
                return {...pre, confirm_pass: val};
              });
            }}
            placeholder="Confirm password"
            secureTextEntry
          />

          <Text style={{color: '#787885', marginLeft: 20, marginTop: 5}}>
            Both passwords must match
          </Text>
        </View>
        <View style={{marginTop: 50}}>
          <Button
            title="Reset Password"
            color="#FF9330"
            onPress={() => {
              navigation.navigate('Login');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default CreateNewPass;
