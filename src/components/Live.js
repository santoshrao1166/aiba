import React from 'react';
import {
  Dimensions,
  Linking,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Header from './Header';
import {axiosGet} from '../axios';

const {height, width} = Dimensions.get('window');

function Live({route, navigation}) {
  const {liveLink, venderName, groupName, vendorId, owner} = route.params;
  const user = useSelector(state => state.user);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    // console.log(liveLink);
    setisLoading(true);
  }, [liveLink]);
  return (
    <ScrollView
      style={{
        backgroundColor: '#ffffff',
        minHeight: height,
      }}
      showsVerticalScrollIndicator={false}>
      <Header
        isAuth={user ? true : false}
        navigation={navigation}
        showLoginBtn
      />
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: width,
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          {liveLink ? (
            <WebView
              onLoad={() => setisLoading(false)}
              source={{
                uri: `https://www.facebook.com/plugins/video.php?href=${liveLink}&show_text=0&autoplay=1`,
              }}
              style={{
                maxWidth: 400,
                maxHeight: 700,
                width: width * 0.8,
                height: width * 1.4,
                overflow: 'scroll',
              }}
              onError={error => {
                console.log(error);
              }}
            />
          ) : (
            <Text style={{marginVertical: 30}}>No live link added yet</Text>
          )}

          {isLoading && (
            <ActivityIndicator
              style={{position: 'absolute', top: width * 0.7, left: width / 2}}
              size="large"
            />
          )}
        </View>

        <Text style={{lineHeight: 40, fontSize: 17, fontWeight: '700'}}>
          {venderName ? 'Vendor Name : ' + venderName : null}
        </Text>
        <Text style={{lineHeight: 30, fontSize: 15}}>
          {groupName ? ' Group Name : ' + groupName : null}
        </Text>

        {owner ? null : (
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 50,
              marginTop: 10,
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
                    Linking.openURL(`https://wa.me/+91${data?.whatsapp_no}`);
                  },
                  null,
                  navigation,
                  dispatch,
                );
              }
            }}>
            <FontAwesome name="whatsapp" size={35} color="#25D366" />
            <Text style={{fontSize: 15, fontWeight: '600', marginTop: 3}}>
              {' '}
              Contact vendor on whatsapp{' '}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

export default Live;
