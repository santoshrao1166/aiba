import React from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Linking,
  ScrollView,
  Pressable,
  Button,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {height, width} = Dimensions.get('window');

const Grevience = ({navigation}) => {
  return (
    <ScrollView style={{backgroundColor: '#F2F2F2'}}>
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
          Grievance
        </Text>

        <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '700',
            marginVertical: 15,
          }}>
          LEGAL DISCLAIMER
        </Text>

        <Text style={{textAlign:'justify'}}>
          All vendors performing live on this platform are genuine. The
          customers purchasing from this platform are requested to make the
          payments only to the numbers given in the description on the top of
          the live show posts or as shown on the screen.{'\n\n'}
          The AIBA Management or any vendor associated with it will not be
          responsible for any negligence in making payments without proper
          verification and will not be held accountable in any way for any such
          business transaction done misusing their brand name.{'\n\n'}
          AIBA is just an online platform and the management will not be held
          responsible for any business dealings taking place on the platform.
          Any controversy in business transactions shall be dealt between the
          vendors and customers alone. {'\n'}
          {'\n'}
          However, for any unresolved requests/ complaints or concerns, you can
          escalate the matter in following ways{'\n'}
          {'\n'}
          {/* <View style={{flexDirection: 'row'}}> */}
            <Text>Level 1- Drop us a mail at</Text>
            <Text
              style={{}}
              onPress={() => {
                Linking.openURL('mailto:aiba.info@gmail.com');
              }}>
              <Text style={{color: 'blue'}}> aiba.info@gmail.com</Text>
            </Text>
          {/* </View> */}
          {'\n'}
          {'\n'}
            <Text style={{lineHeight:20}}>Level 2 - Drop a whatsapp message to our Grievance Officer at</Text>
            {/* <TouchableOpacity style={{paddingTop:10}}
              onPress={() => {
                Linking.openURL('https://wa.me/+919664205652');
              }}>
              <Text style={{color: 'blue'}}> 9664205652.</Text>
            </TouchableOpacity>
            */}
            <Text onPress={() => {
                Linking.openURL('https://wa.me/+919664205652');
              }} style={{color: 'blue'}}> 9664205652.</Text>

          {'\n'}
          {'\n'}
          You will get a response within 4-5 business days. {'\n'}
        </Text>
        <Text style={{}}>
          SHOP WISE !!
        </Text>
        <View style={{flex:1,flexDirection:'row',alignItems:'flex-start',justifyContent:'center',width:width*0.8}}>
        <Text style={{fontWeight:'700',paddingVertical:10}}>Address : </Text>
        <Text style={{textAlign:'justify',paddingVertical:10}}>
         First Floor, 183-A, Gautam Nagar, New Delhi, New Delhi, Delhi, 110049
        </Text>
        </View>
    
      </View>
    </ScrollView>
  );
};

export default Grevience;
