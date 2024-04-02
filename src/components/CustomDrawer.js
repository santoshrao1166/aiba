import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/auth';
import { axiosGet } from '../axios';

const { height, width } = Dimensions.get('window');

function CustomDrawer(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [categories, setcategories] = useState([]);

  const getcategory = async () => {
    axiosGet(
      'user/all_categories_master',
      categories => {
        setcategories(categories);
      },
      null,
      navigation,
      dispatch,
    );
  };

  const logoutFromApp = async () => {
    try {
      AsyncStorage.removeItem('aibaUser');
      AsyncStorage.removeItem('aibaPass');
      axiosGet(
        'auth/user_logout',
        res => console.log(res),
        res => console.log(res),
        navigation,
        dispatch,
      );
      dispatch(logout());
      Alert.alert('', 'Logout successful.');
      navigation.navigate('Home');
    } catch (error) {
      dispatch(logout());
    }
  };

  useEffect(() => {
    getcategory();
    return () => {
      setcategories([]);
    };
  }, []);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#F2F2F2',
        minHeight: height,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: width * 0.05,
            paddingVertical: height * 0.03,
          }}>
          {/* cross btn  */}
          <TouchableOpacity
            style={{ height: height * 0.1 }}
            onPress={() => {
              navigation.toggleDrawer();
            }}>
            <Entypo name="cross" size={35} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          {/* all navigation btn  */}
          <View style={styles.allNavBtn}>
            <View>
              {/* home navigation */}
              <TouchableOpacity
                style={styles.TouchableOpacityStyle}
                onPress={() => {
                  navigation.navigate('Home');
                }}>
                <AntDesign name="home" size={35} />
                <Text style={styles.TouchableOpacityText}>Home</Text>
              </TouchableOpacity>

              {/* live shows of all Categories  */}
              <ExpandableView
                leftIcon={<MaterialIcons name="live-tv" size={35} />}
                title="Live Shows"
                innerContent={
                  <ExpandableView
                    title="Categories"
                    leftIcon={<MaterialIcons name="category" size={35} />}
                    innerContent={categories?.map((item, key) => (
                      <TouchableOpacity
                        key={key}
                        style={{ marginLeft: width * 0.05 }}
                        onPress={() =>
                          navigation.navigate('CategoryLive', { ctgId: item?.id })
                        }>
                        <Text style={styles.ExpandableOptionText}>
                          {' '}
                          {item.name}{' '}
                        </Text>

                        <View
                          style={{
                            width: '100%',
                            height: 1,
                            backgroundColor: '#000',
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  />
                }
              />

              {/* product listings of all Categories  */}
              {/* <ExpandableView
                leftIcon={<MaterialIcons name="inventory" size={35} />}
                title="Product Listing"
                innerContent={
                  <ExpandableView
                    title="Categories"
                    leftIcon={<MaterialIcons name="category" size={35} />}
                    innerContent={categories?.map((item, key) => (
                      <TouchableOpacity
                        key={key}
                        style={{marginLeft: width * 0.05}}
                        onPress={() => onClickCtg(item)}>
                        <Text style={styles.ExpandableOptionText}>
                          {' '}
                          {item.name}{' '}
                        </Text>

                        <View
                          style={{
                            width: '100%',
                            height: 1,
                            backgroundColor: '#000',
                          }}
                        />
                      </TouchableOpacity>
                    ))}
                  />
                }
              /> */}
              {user ? (
                <>
                  {/* profile navigation  */}
                  <TouchableOpacity
                    style={styles.TouchableOpacityStyle}
                    onPress={() => {
                      navigation.navigate('My Profile');
                    }}>
                    <Image
                      style={{ width: 35, height: 35 }}
                      source={{
                        uri: 'https://lh3.googleusercontent.com/-IfVyZZdWZtA/YU6uBaDTd-I/AAAAAAAAAfo/QHfi38olN7snFfolyeucQANXgIZf5tCYACLcBGAsYHQ/user%2B1.png',
                        // cache: 'only-if-cached',
                      }}
                    />
                    <Text style={styles.TouchableOpacityText}>Profile</Text>
                  </TouchableOpacity>

                  {user?.profile_type ? null : (
                    <>
                      {/* my lives  */}
                      <TouchableOpacity
                        style={styles.TouchableOpacityStyle}
                        onPress={() => {
                          navigation.navigate('vendorLive', {
                            vendorId: user?.id,
                          });
                        }}>
                        <MaterialIcons name="live-tv" size={35} />

                        <Text style={styles.TouchableOpacityText}>
                          My Lives
                        </Text>
                      </TouchableOpacity>
                      {/* book slot  */}
                      <TouchableOpacity
                        style={styles.TouchableOpacityStyle}
                        onPress={() => {
                          navigation.navigate('Book Slot');
                        }}>
                        <Image
                          style={{ width: 35, height: 35 }}
                          source={{
                            uri: 'https://lh3.googleusercontent.com/-LKQAwU2Wlzw/YU6synV7GhI/AAAAAAAAAfc/EhOLng9IzHsuR72bUTWyoLtpYPpFX02QACLcBGAsYHQ/booking%2B1.png',
                            // cache: 'only-if-cached',
                          }}
                        />
                        <Text style={styles.TouchableOpacityText}>
                          Book AIBA 1 to 4
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.TouchableOpacityStyle}
                        onPress={() => {
                          navigation.navigate('Book Aiba 5to7');
                        }}>
                        <Image
                          style={{ width: 35, height: 35 }}
                          source={{
                            uri: 'https://lh3.googleusercontent.com/-LKQAwU2Wlzw/YU6synV7GhI/AAAAAAAAAfc/EhOLng9IzHsuR72bUTWyoLtpYPpFX02QACLcBGAsYHQ/booking%2B1.png',
                            // cache: 'only-if-cached',
                          }}
                        />
                        <Text style={styles.TouchableOpacityText}>
                        Book AIBA 5 to 7
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.TouchableOpacityStyle}
                        onPress={() => {
                          navigation.navigate('Odd Hours');
                        }}>
                        <Image
                          style={{ width: 35, height: 35 }}
                          source={{
                            uri: 'https://lh3.googleusercontent.com/-LKQAwU2Wlzw/YU6synV7GhI/AAAAAAAAAfc/EhOLng9IzHsuR72bUTWyoLtpYPpFX02QACLcBGAsYHQ/booking%2B1.png',
                            // cache: 'only-if-cached',
                          }}
                        />
                        <Text style={styles.TouchableOpacityText}>
                        Book AIBA Odd Hours
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.TouchableOpacityStyle}
                        onPress={() => {
                          navigation.navigate('Sd Hours');
                        }}>
                        <Image
                          style={{ width: 35, height: 35 }}
                          source={{
                            uri: 'https://lh3.googleusercontent.com/-LKQAwU2Wlzw/YU6synV7GhI/AAAAAAAAAfc/EhOLng9IzHsuR72bUTWyoLtpYPpFX02QACLcBGAsYHQ/booking%2B1.png',
                            // cache: 'only-if-cached',
                          }}
                        />
                        <Text style={styles.TouchableOpacityText}>
                        Book Shoppers’ Darbar Live
                        </Text>
                      </TouchableOpacity>
                      {/* book sd slot  */}
                      <TouchableOpacity
                        style={styles.TouchableOpacityStyle}
                        onPress={() => {
                          navigation.navigate('BuySdPlan');
                        }}>
                        <Image
                          style={{ width: 35, height: 35 }}
                          source={{
                            uri: 'https://lh3.googleusercontent.com/-3d80qJA53Ho/YbGHxdVXpOI/AAAAAAAAAk4/OCI9dJ75AnYa-GK_G_GADq4S6KTCQQ98ACNcBGAsYHQ/3488541-200.png',
                            // cache: 'only-if-cached',
                          }}
                        />
                        <Text style={styles.TouchableOpacityText}>
                          Shoppers’ Darbar Posting Regn
                        </Text>
                      </TouchableOpacity>
                      {/* book advert hour pages  */}
                      <TouchableOpacity
                        style={styles.TouchableOpacityStyle}
                        onPress={() => {
                          navigation.navigate('AdvertHourBooking');
                        }}>
                        <Image
                          style={{ width: 35, height: 35 }}
                          source={{
                            uri: 'https://lh3.googleusercontent.com/-xMdHcNbLv_M/YbGKH7cRHjI/AAAAAAAAAlI/0wW0qEF8EzYWKOdAXIbQQsR6Z7cqyZwegCNcBGAsYHQ/advertising%252Bannouncement%252Bmegaphone%252Bonline%252Bonlineadvert-1320185969836717290.png',
                            // cache: 'only-if-cached',
                          }}
                        />
                        <Text style={styles.TouchableOpacityText}>
                          Advert Page Booking
                        </Text>
                      </TouchableOpacity>
                      {/* my bookings  */}
                      <TouchableOpacity
                        style={styles.TouchableOpacityStyle}
                        onPress={() => {
                          navigation.navigate('My Bookings');
                        }}>
                        {/* <FontAwesome name="user-o" size={35} /> */}
                        <Image
                          style={{ width: 35, height: 35 }}
                          source={{
                            uri: 'https://lh3.googleusercontent.com/-bdJilDAAeZc/YU6sx_btH1I/AAAAAAAAAfU/Rdh5WoYWax0v7L1se6YnEvMxyAXESOruwCLcBGAsYHQ/calendar%2B%25281%2529%2B1.png',
                            // cache: 'only-if-cached',
                          }}
                        />
                        <Text style={styles.TouchableOpacityText}>
                          My Bookings
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.TouchableOpacityStyle}
                    onPress={() => {
                      navigation.navigate('Customer Login');
                    }}>
                    <Image
                      style={{ width: 35, height: 35 }}
                      source={{
                        uri: 'https://lh3.googleusercontent.com/-nBTnvTKqQHY/YbMRyvQWPHI/AAAAAAAAAlo/hIiGKsZS68U6_yPzSjRK-Uo46OL3u1XXgCNcBGAsYHQ/Customer%2Blogin.png',
                        // cache: 'only-if-cached',
                      }}
                    />
                    {/* <Entypo name="login" size={35} /> */}
                    <Text style={styles.TouchableOpacityText}>
                      Customer Login
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.TouchableOpacityStyle}
                    onPress={() => {
                      navigation.navigate('Login');
                    }}>
                    <Image
                      style={{ width: 35, height: 35 }}
                      source={{
                        uri: 'https://lh3.googleusercontent.com/-KjbMdlyjTaI/YbMRykKFXsI/AAAAAAAAAlw/ki75b0scbwcIoNyGmRQ33998Kx7i16qjQCNcBGAsYHQ/Vendor%2Blogin.png',
                      }}
                    />
                    {/* <Entypo name="login" size={35} /> */}
                    <Text style={styles.TouchableOpacityText}>
                      Vendor Login
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.TouchableOpacityStyle}
                    onPress={() => {
                      navigation.navigate('Customer Signup');
                    }}>
                    <Image
                      style={{ width: 35, height: 35 }}
                      source={{
                        uri: 'https://lh3.googleusercontent.com/-H--L5df_ihk/YbMRyvzXPfI/AAAAAAAAAlg/IMMd_jltAqcJ1gn21axrYVsLndq7v2grwCNcBGAsYHQ/Customer%2Breg.png',
                      }}
                    />
                    {/* <MaterialIcons name="app-registration" size={35} /> */}
                    <Text style={styles.TouchableOpacityText}>
                      Customer Registration
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.TouchableOpacityStyle}
                    onPress={() => {
                      navigation.navigate('Vendor Registration');
                    }}>
                    <Image
                      style={{ width: 35, height: 35 }}
                      source={{
                        uri: 'https://lh3.googleusercontent.com/-l_lgn-chplk/YbMRyjlzG3I/AAAAAAAAAlk/1tmtVd2NfO0wmJLhYv6IZLEy3W4ST8J3gCNcBGAsYHQ/Vendor%2Breg.png',
                      }}
                    />
                    {/* <MaterialIcons name="app-registration" size={35} /> */}
                    <Text style={styles.TouchableOpacityText}>
                      Vendor Registration
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                style={styles.TouchableOpacityStyle}
                onPress={() => {
                  navigation.navigate('Grevience');
                }}>
                <Image
                  style={{ width: 35, height: 35 }}
                  source={{
                    uri: 'https://lh3.googleusercontent.com/-w8oY3G_stO0/YbMRyhRdKsI/AAAAAAAAAls/VqN9_nPchA8cT8KoRllDIbfxxIWAHZo3gCNcBGAsYHQ/Grievance.png',
                    // cache: 'only-if-cached',
                  }}
                />
                {/* <AntDesign name="message1" size={35} /> */}
                <Text style={styles.TouchableOpacityText}>Grievance</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* btn for sign out  */}
          {user ? (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 20,
              }}
              onPress={logoutFromApp}>
              <Text
                style={{ fontSize: 20, fontWeight: '700', marginHorizontal: 20 }}>
                Sign-out
              </Text>
              <MaterialIcons name="exit-to-app" size={35} />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CustomDrawer;

const ExpandableView = ({ title, innerContent, leftIcon }) => {
  const [expanded, setexpanded] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setexpanded(pre => !pre);
  };
  return (
    <>
      <TouchableOpacity
        style={styles.TouchableOpacityStyle}
        onPress={toggleExpand}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {leftIcon}
            <Text style={styles.TouchableOpacityText}>{title}</Text>
          </View>
          {expanded ? (
            <AntDesign name="minus" size={20} />
          ) : (
            <AntDesign name="plus" size={20} />
          )}
        </View>
      </TouchableOpacity>

      <View
        style={{
          height: expanded ? null : 0,
          overflow: 'hidden',
          marginLeft: width * 0.05,
        }}>
        <View>{innerContent}</View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  allNavBtn: {
    minHeight: height * 0.68,
    width: width * 0.9,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  TouchableOpacityStyle: {
    borderBottomColor: '#696969',
    borderBottomWidth: 0.3,
    width: width * 0.8,
    marginHorizontal: width * 0.05,
    paddingHorizontal: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
  },
  TouchableOpacityText: {
    fontSize: 17,
    fontWeight: '400',
    marginLeft: 30,
    paddingVertical: 15,
  },
  ExpandableOptionText: {
    fontSize: 17,
    fontWeight: '400',
    marginLeft: 5,
    paddingVertical: 15,
  },
});
