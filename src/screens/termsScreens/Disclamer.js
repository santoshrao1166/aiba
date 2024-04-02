import React from 'react';
import {View, TouchableOpacity, Dimensions, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {height, width} = Dimensions.get('window');

const Disclamer = ({navigation}) => {
  return (
    <View style={{backgroundColor: '#F2F2F2', height: height}}>
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
          DISCLAIMER
        </Text>

        <Text
          style={{
            fontSize: height * 0.02,
            fontWeight: '700',
            marginVertical: 15,
          }}>
          AIBA (ALL INDIA BUSINESSWOMEN’S ASSOCIATION)
        </Text>

        <Text style={{textAlign:'justify'}}>
          Shoppers’ Darbar and All India BusinessWomen’s Association are e-com
          service providers between the buyers and sellers. The SD-AIBA
          management will not be responsible for any business transaction taking
          place on their app. The SD-AIBA management will not intervene in any
          controversy arising from any business transaction taking place on
          their app. The customers are advised to use their discretion while
          making the purchases, verify the complete details of the vendors,
          confirm their exchange and return policies. It is in the interest of
          the customers to request the vendors for the actual picture of the
          products, its material and all other relevant details. Please note, in
          most of the online purchases it has now become mandatory to make a
          parcel opening video which should be shot properly and in one go.
          {'\n\n'}
          The management will also not be liable for any loss or damage caused
          by natural causes such as viruses or other technologically harmful
          material that may infect your computer equipment, computer programs,
          data or other proprietary material due to your use of this app or to
          your downloading of any material posted on it, or on any website
          linked to it.
        </Text>
      </View>
    </View>
  );
};

export default Disclamer;
