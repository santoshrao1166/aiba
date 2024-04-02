import React from 'react';
import {
  Button,
  Dimensions,
  Image,
  Linking,
  NativeModules,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {height, width} = Dimensions.get('window');

function ForgetPass2({navigation}) {
  function openMailApp() {
    console.log('sdfksadkfk');
    if (Platform.OS === 'android') {
      try {
        Linking.openURL('https://mail.google.com/');
      } catch (error) {
        console.log(error);
      }
      navigation.navigate('Home');
      return;
    }
    try {
      Linking.openURL('message:0'); // iOS
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  }
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
          <Pressable
            onPress={() => {
              navigation.navigate('ForgetPass');
            }}>
            <MaterialIcons name="arrow-back-ios" size={25} />
          </Pressable>
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
              <Text style={{fontSize: 25, fontWeight: '700', paddingBottom: 7}}>
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
              uri: 'https://lh3.googleusercontent.com/-4lg52fxWUes/YVFU7rzIS4I/AAAAAAAAAgE/c25Si84V6Yk1_4DPskBiSoCF37n3zEvwwCLcBGAsYHQ/email%2B1.png',
            }}
          />
        </View>

        <Text
          style={{
            marginTop: 30,
            fontSize: 17,
            fontWeight: '700',
            color: '#4E4957',
            textAlign: 'center',
          }}>
          Check your email
        </Text>
        <Text
          style={{
            color: '#4E4957',
            textAlign: 'center',
            fontSize: 13,
            marginTop: 15,
          }}>
          We have sent a password recovery{'\n'}instructuion in your email
        </Text>

        <View style={{marginTop: 50}}>
          <Button
            title="open email app"
            color="#FF9330"
            onPress={openMailApp}
          />
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
    borderColor: '#FF9330',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});

export default ForgetPass2;
