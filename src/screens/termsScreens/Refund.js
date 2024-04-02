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

const Refund = ({navigation}) => {
  return (
    <ScrollView style={{backgroundColor: '#F2F2F2', height: height}}>
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
        <Text
          style={{
            fontSize: height * 0.03,
            fontWeight: '700',
            marginBottom: 15,
          }}>
          Refunds and Cancellations
        </Text>

        <Text
          style={{
            marginBottom: 30,
          }}>
          For the Sellers on Board - The booking of slots on AIBA, once booked,
          is considered final and cannot be changed. Exchanges will be permitted
          only in genuine cases, as per admins’ discretion, however, penalty
          will be applicable.{'\n\n'}No refund shall be issued if a member
          decides to terminate their membership in the middle of the term
          {'\n\n'}or{'\n\n'}
          The AIBA Management finds them guilty of flouting the rules/ any
          misdemeanour and decides to terminate the membership before the
          term-end.
          {'\n\n'}For the Customers on Board - The AIBA management will not
          intervene in any controversy arising from any business transaction
          taking place on their app. The customers are advised to use their
          discretion while making the purchases, verify the complete details of
          the vendors, confirm their exchange and return policies. It is in the
          interest of the customers to request the vendors for the actual
          picture of the products, its material and all other relevant details.
          Please note, in most of the online purchases it has now become
          mandatory to make a parcel opening video which should be shot properly
          and in one go.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Refund;
