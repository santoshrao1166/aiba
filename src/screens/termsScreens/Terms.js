import React from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Text,
  ScrollView,
  Button,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {height, width} = Dimensions.get('window');

const Terms = ({navigation}) => {
  return (
    <ScrollView style={{backgroundColor: '#F2F2F2', height: height}}>
      {/* <StatusBar backgroundColor="#F2F2F2" /> */}
      {/* back and hambuger */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: height * 0.1,
          alignItems: 'center',
          marginHorizontal: width * 0.05,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons name="arrow-back-ios" size={25} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <FontAwesome5 name="bars" size={25} style={{marginLeft: 24}} />
        </TouchableOpacity>
      </View>
      {/* remaining body is in this view  */}
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,

          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: height * 0.03, fontWeight: '700'}}>
          TERMS AND CONDITIONS
        </Text>

        {/* <Text style={{marginVertical: 15}}>
          When you visit our website and register with us, we automatically
          receive and store certain types of information. Most of the
          information which may collect may be used in one of the following
          ways:
          {'\n'}
          {'\n'}
          {'\n'}
          1. To process transactions; and/or
          {'\n'}
          {'\n'}
          2. For logistical operations; and/or
          {'\n'}
          {'\n'}
          3. To send you information regarding our products and promotions.
          {'\n'}
          {'\n'}
          Access to your personal or statistical information is restricted to
          employees and associates on a need to know basis only.
          {'\n'}
          {'\n'}
          Your information, whether personal or statistical, will not be sold,
          exchanged, transferred, or given to any other company for any reason
          whatsoever, without your consent, other than for the express purpose
          of delivering the purchased product or service requested.
          {'\n'}
          {'\n'}
          Your information, whether personal or statistical, will not be sold,
          exchanged, transferred, or given to any other company for any reason
          whatsoever, without your consent, other than for the express purpose
          of delivering the purchased product or service requested.
          {'\n'}
          {'\n'}
        </Text> */}
        <Text style={{textAlign:'justify',marginVertical:15}}>
        By using this website or ordering products from this website you agree to be bound by all of the terms and conditions of this agreement. Please read the terms of use carefully before using this website. Your use of the website or the products and services provided by the website shall imply your acceptance of the terms of use and your agreement to be legally bound by the same.
{"\n\n"}
The AIBA Management reserves the right to change or revise the Terms and Conditions mentioned upon the website at any time.
        </Text>

        {/* <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '700',
            marginVertical: 15,
          }}>
          COPYRIGHT NOTICE
        </Text>

        <Text
          style={{
            marginBottom: 30,
          }}>
          This website and its content is copyright of AIBA. Any redistribution
          or reproduction of part or all of the contents in any form is
          prohibited.
        </Text>
        <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '700',
            marginVertical: 15,
          }}>
          INDEMNFICATION
        </Text>

        <Text
          style={{
            marginBottom: 30,
          }}>
          You shall indemnify and hold harmless ( https://www.aibaonline.in/) its
          owners, and its employees, from any claim or demand, or actions
          including reasonable attorneys' fees, made by any third party or
          penalty imposed due to or arising out of your breach of this Terms of
          Use, privacy Policy and other Policies, or your violation of any law,
          rules or regulations or the rights of a third party.
        </Text> */}
      </View>
    </ScrollView>
  );
};

export default Terms;
