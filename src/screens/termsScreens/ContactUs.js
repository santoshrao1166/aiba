import React from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {height, width} = Dimensions.get('window');

const ContactUs = ({navigation}) => {
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
        <Text style={{fontSize: height * 0.04, fontWeight: '700'}}>
          TERMS AND CONDITIONS
        </Text>

        {/* all notification are here */}
        <View style={{marginHorizontal: width * 0.05, marginTop: 10}}>
          <Text
            style={{
              fontSize: height * 0.02,
              fontWeight: '700',
              marginVertical: 15,
            }}>
            AIBA (ALL INDIA BUSINESSWOMEN’S ASSOCIATION)
          </Text>

          <Text>
            AIBA is an elite online business community of women entrepreneurs
            connected via Facebook. AIBA is placed amongst the topmost
            e-commerce portals on Facebook and is continuing its upward climb
            unwaveringly. This online shopping portal ab initio enjoys the
            support of refined and genuine customer base and impeccable
            reputation. Our team has taken special efforts to bring various
            manufacturers, sellers and resellers under one roof to ease out the
            online shopping for the customers and also to aid the vendors in
            combating the aftermath of the pandemic.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ContactUs;
