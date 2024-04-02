import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {serverEndPoint} from '../config';

const {width} = Dimensions.get('window');

function CtgLive({navigation, live}) {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 10,
      }}
      onPress={() => {
        if (live?.live_link)
          navigation.navigate('Live', {
            ////jfkaslkdfjlkasdf
            liveLink: live?.live_link,
            vendorId: live?.user_id,
            venderName: live?.name,
            groupName: live?.group_name,
          });
        else {
          // Alert.alert('Heya', 'No live link added yet.');
          return;
        }
      }}>
      <View
        style={{
          width: 300,
          height: 360,
          borderRadius: 25,
          // backgroundColor: 'transparent',
          marginHorizontal: width * 0.02,
        }}>
        <ImageBackground
          source={{
            uri: live?.profile_image
              ? serverEndPoint + 'uploads/docs/' + live?.profile_image
              : 'https://ui-avatars.com/api/?name=' + live?.name,
          }}
          style={{
            width: 300,
            height: 360,
            borderRadius: 25,
            marginHorizontal: width * 0.02,
          }}>
          <View style={{marginLeft: 'auto', marginTop: 14, marginRight: 23}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Entypo name="dot-single" size={30} color="#ffffff" />
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  fontWeight: '700',
                  letterSpacing: 1,
                }}>
                Live
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 300,
              height: 240,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(255,255,255,0.5)',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AntDesign name="play" size={60} color="white" />
            </View>
          </View>
          <UserData
            live={live}
            vendorId={live?.user_id}
            navigation={navigation}
          />
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}

export default CtgLive;

export const CategoryBtn = ({id, setcurCtg, category, active}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setcurCtg(id);
      }}
      style={{
        height: 41,
        marginRight: 9,
        borderRadius: 8,
        backgroundColor: active ? '#FF9432' : '#E5E5E5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        elevation: active ? 3 : 0,
      }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
          lineHeight: 21,
          textAlign: 'center',
          color: active ? 'white' : '#9D9FA0',
        }}>
        {category}
      </Text>
    </TouchableOpacity>
  );
};
const UserData = ({vendorId}) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#24A8E0',
          marginVertical: 10,
          paddingVertical: 4,
          borderRadius: 18,
          marginHorizontal: 10,
        }}
        onPress={() => {
          console.log(vendorId);
          if (!user) {
            Alert.alert(
              'Login first',
              'You have to login to contact with seller.',
            );
            navigation.navigate('Customer Login');
          } else if (vendorId) {
            axiosGet(
              'user/vendor_contact_details?id=' + vendorId,
              data => {
                console.log(data);
                Linking.openURL(`http://wa.me/+91${data?.whatsapp_no}`);
              },
              null,
              navigation,
              dispatch,
            );
          }
        }}>
        <FontAwesome name="whatsapp" size={20} color="#25D366" />
        <Text style={{color: 'white', fontSize: 12, marginLeft: 3}}>
          Contact Seller
        </Text>
      </TouchableOpacity>
    </>
  );
  // return (
  //   <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
  //     <View style={{marginLeft: 15}}>
  //       <Text style={{fontSize: 18, lineHeight: 24.5, color: '#FFFFFF'}}>
  //         {live?.name}
  //       </Text>
  //       <Text style={{fontSize: 12, lineHeight: 15, color: '#9D9FA0'}}>
  //         {live?.group_name}
  //       </Text>
  //     </View>
  //   </View>
  // );
};
