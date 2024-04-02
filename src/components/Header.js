import React from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import aibaLogo from '../assets/aibaLogo.png';
import {useSelector} from 'react-redux';

const {height, width} = Dimensions.get('window');

function Header({isAuth, navigation, showLoginBtn}) {
  const user = useSelector(state => state.user);
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {/* logo of app in header */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <View style={{flexDirection: 'row'}}>
            {/* shopper darbar logo  */}

            <View
              style={{
                paddingRight: 10,
              }}>
              <Image
                style={{width: width * 0.4, height: 70}}
                source={aibaLogo}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {isAuth ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Search');
                }}>
                <FontAwesome name="search" size={20} color="#FF9330" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('My Profile');
                }}>
                <FontAwesome
                  name="user-circle-o"
                  size={20}
                  color="#FF9330"
                  style={{marginLeft: 24}}
                />
              </TouchableOpacity>
              {user?.profile_type ? null : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Notification');
                  }}>
                  {/* <View> */}
                  <Ionicons
                    name="notifications"
                    size={20}
                    color="#FF9330"
                    style={{marginLeft: 24}}
                  />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              {showLoginBtn ? (
                <TouchableOpacity
                  // style={{height: 30}}
                  onPress={() => navigation.navigate('Login')}
                  style={styles.loginBtn}>
                  <FontAwesome name="user-circle-o" size={15} color="#ffffff" />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: '500',
                      paddingLeft: 4,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              ) : null}
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}>
            <FontAwesome5
              name="bars"
              size={20}
              color="#FF9330"
              style={{
                marginLeft: 30,
                marginVertical: 10,
                paddingRight: width * 0.05,
                paddingVertical: 10,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginVertical: height * 0.03,
  },
  loginBtn: {
    backgroundColor: '#FFB800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default Header;
