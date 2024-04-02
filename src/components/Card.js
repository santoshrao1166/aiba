import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Dimensions,
  Image,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {axiosGet} from '../axios';
import {serverEndPoint} from '../config';
const {height, width} = Dimensions.get('window');

function Card({navigation, liveLink, Live, vendorId}) {
  return (
    <View>
      <TouchableOpacity
        style={{
          borderRadius: 15,
          overflow: 'hidden',
          marginHorizontal: 10,
        }}
        onPress={() => {
          if (liveLink)
            navigation.navigate('Live', {
              ////jfkaslkdfjlkasdf
              liveLink: liveLink,
              vendorId: vendorId,
              venderName: Live?.name,
              groupName: Live?.group_name,
            });
          else {
            // Alert.alert('Heya', 'No live link added yet.');
            return;
          }
        }}>
        <Toumbnail liveLink={liveLink} live={Live} />
      </TouchableOpacity>
      <UserData vendorId={vendorId} navigation={navigation} />
    </View>
  );
}

export default Card;

const UserData = ({vendorId, navigation}) => {
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
          // console.log(vendorId);
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
                // console.log(data);
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
};

export const Toumbnail = ({live, previous}) => {
  // console.log(live);
  return (
    <>
      <View style={{position: 'relative', borderRadius: 7}}>
        <Image
          source={{
            // uri: liveLink,
            uri: live?.profile_image
              ? serverEndPoint + 'uploads/docs/' + live?.profile_image
              : 'https://ui-avatars.com/api/?name=' + live?.name
              ? live?.name
              : live?.vendor_name,
          }}
          style={{
            width: width * 0.36,
            height: width * 0.22,
            borderRadius: 7,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: width * 0.36,
            height: width * 0.22,
          }}>
          {previous ? null : (
            <View style={{marginRight: 5, marginTop: 5, marginLeft: 'auto'}}>
              <Text
                style={{
                  backgroundColor: '#FF0000',
                  paddingHorizontal: 15,
                  paddingVertical: 1,
                  color: 'white',
                  borderRadius: 3,
                  fontSize: 10,
                }}>
                LIVE
              </Text>
            </View>
          )}
          <View
            style={{
              width: width * 0.36,
              height: width * 0.14,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.5)',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AntDesign name="play" size={28} color="white" />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
