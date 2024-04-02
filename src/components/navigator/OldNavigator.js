import React, {useEffect} from 'react';
import {Dimensions, Appearance} from 'react-native';
//all screens
import CustomDrawer from '../CustomDrawer';
import Home from '../../screens/Home';
import Notification from '../../screens/Notification';
import MyBooking from '../../screens/MyBooking';
import MyProfile from '../../screens/MyProfile';

import CreateNewPass from '../../screens/CreateNewPass';
import Live from '../Live';
import Terms from '../../screens/termsScreens/Terms';
import About from '../../screens/termsScreens/About';
import Search from '../../screens/Search';
import Disclamer from '../../screens/termsScreens/Disclamer';
import ContactUs from '../../screens/termsScreens/ContactUs';
import Refund from '../../screens/termsScreens/Refund';
//importing redux module to managing state
import {Provider, useDispatch, useSelector} from 'react-redux';
import {createStore} from 'redux';
import {allReducer} from '../../redux/reducer';
import {setTheme, changeTheme} from '../../redux/action/theme';
//navigation modules
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  notificationListner,
  requestUserPermission,
} from '../../importantFeatures';

//for deep link
import linking from '../../linking';
import LoginNavigator from './LoginNavigator';
import VendorRegistrationNavigator from './VendorRegistrationNavigator';
import BookSlotNavigator from './BookSlotNavigator';
import Grevience from '../../screens/termsScreens/Grevience';
import Login from '../../screens/customer/Login';
import Signup from '../../screens/customer/Signup';

const {height, width} = Dimensions.get('window');

const Drawer = createDrawerNavigator();
// const myStore = createStore(allReducer);
const MainNavigator = () => {
  useEffect(() => {
    requestUserPermission();
    notificationListner();
  }, []);
  return (
    // <Provider store={myStore}>
    <RouteNavigator />
    // </Provider>
  );
};

const RouteNavigator = () => {
  const colorScheme = Appearance.getColorScheme();
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTheme(colorScheme));
    Appearance.addChangeListener(({changedScheme}) => {
      if (changedScheme == 'dark' || changedScheme == 'light')
        dispatch(changeTheme(changedScheme));
    });
  }, [dispatch, colorScheme]);
  return (
    <NavigationContainer
      theme={theme == 'dark' ? DarkTheme : DefaultTheme}
      linking={linking}>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: width,
          },
        }}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen
          name="Vendor Registration"
          component={VendorRegistrationNavigator}
        />
        <Drawer.Screen name="Notification" component={Notification} />
        <Drawer.Screen name="Login" component={LoginNavigator} />
        <Drawer.Screen name="Customer Login" component={Login} />
        <Drawer.Screen name="Customer Signup" component={Signup} />
        <Drawer.Screen name="CreateNewPass" component={CreateNewPass} />

        <Drawer.Screen name="Search" component={Search} />
        <Drawer.Screen name="My Profile" component={MyProfile} />
        <Drawer.Screen name="My Bookings" component={MyBooking} />
        <Drawer.Screen name="Book Slot" component={BookSlotNavigator} />
        <Drawer.Screen name="Live" component={Live} />
        <Drawer.Screen name="Terms" component={Terms} />
        <Drawer.Screen name="AboutUs" component={About} />
        <Drawer.Screen name="ContactUs" component={ContactUs} />
        <Drawer.Screen name="Disclamer" component={Disclamer} />
        <Drawer.Screen name="Refund" component={Refund} />
        <Drawer.Screen name="Grevience" component={Grevience} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
