import React, { useEffect } from 'react';
import { Dimensions, Appearance } from 'react-native';
//all screens
import CustomDrawer from '../CustomDrawer';
import Home from '../../screens/Home';
import Notification from '../../screens/Notification';
import MyBooking from '../../screens/MyBooking';
import MyProfile from '../../screens/MyProfile';
import BookSlot from '../../screens/BookSlot';
import PaymentEntry from '../../screens/PaymentEntry';
import VendorRegistration from '../../screens/VendorRegistration';
import Login from '../../screens/Login';
import ForgetPass from '../../screens/ForgetPass';
import ForgetPass2 from '../../screens/ForgetPass2';
import CreateNewPass from '../../screens/CreateNewPass';
import Live from '../Live';
import Terms from '../../screens/termsScreens/Terms';
import About from '../../screens/termsScreens/About';
import Search from '../../screens/Search';
import Disclamer from '../../screens/termsScreens/Disclamer';
import ContactUs from '../../screens/termsScreens/ContactUs';
import Refund from '../../screens/termsScreens/Refund';
//importing redux module to managing state
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createStore } from 'redux';
import { allReducer } from '../../redux/reducer';
import { setTheme, changeTheme } from '../../redux/action/theme';
//navigation modules
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
// import {
//   notificationListner,
//   requestForTrckingPermission,
//   requestUserPermission,
// } from '../../importantFeatures';
import {
  requestForTrckingPermission,
} from '../../importantFeatures';
//for deep link
import linking from '../../linking';
// import LoginNavigator from './LoginNavigator';
// import VendorRegistrationNavigator from './VendorRegistrationNavigator';
// import BookSlotNavigator from './BookSlotNavigator';
import Grevience from '../../screens/termsScreens/Grevience';
import CustomerLogin from '../../screens/customer/Login';
import Signup from '../../screens/customer/Signup';
import Catalogue from '../../screens/Catalogue';
import VendorLiveDetails from '../../screens/VendorLiveDetails';
import AdvertHourBooking from '../../screens/AdvertHourBooking';
import CategoryLive from '../../screens/CategoryLive';
import BuySdPlan from '../../screens/BuySdPlan';
import SdBooking from '../../screens/sdAndAdvBooking/SdBooking';
import MultiOddBooking from '../../screens/multiBookings/OddBooking';
import MultiSdBooking from '../../screens/multiBookings/SDLiveBooking';
import AdvBooking from '../../screens/sdAndAdvBooking/AdvBooking';
import CatalogueSeenToAll from '../../screens/CatalogueSeenToAll';
import OddHours from '../../screens/OddHours';
import SdHours from '../../screens/SdHours';
import BookAiba5to7 from '../../screens/BookAiba5to7';
import Aiba5to7 from '../../screens/multiBookings/Aiba5to7';

const { height, width } = Dimensions.get('window');

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const MainNavigator = () => {
  useEffect(() => {
    // requestUserPermission();
    // notificationListner();
    requestForTrckingPermission();
  }, []);
  return <RouteNavigator />;
};

const RouteNavigator = () => {
  const colorScheme = Appearance.getColorScheme();
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTheme(colorScheme));
    Appearance.addChangeListener(({ changedScheme }) => {
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
        <Drawer.Screen name="aiba" component={StackNav} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />

      {/* added after making whole  */}
      <Stack.Screen name="BuySdPlan" component={BuySdPlan} />
      <Stack.Screen name="Catalogue" component={Catalogue} />
      <Stack.Screen name="CatalogueSeenToAll" component={CatalogueSeenToAll} />
      <Stack.Screen name="AdvertHourBooking" component={AdvertHourBooking} />
      <Stack.Screen name="vendorLive" component={VendorLiveDetails} />
      <Stack.Screen name="CategoryLive" component={CategoryLive} />

      <Stack.Screen name="Vendor Registration" component={VendorRegistration} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPass" component={ForgetPass} />
      <Stack.Screen name="ForgetPass2" component={ForgetPass2} />
      <Stack.Screen name="Customer Login" component={CustomerLogin} />
      <Stack.Screen name="Customer Signup" component={Signup} />
      <Stack.Screen name="CreateNewPass" component={CreateNewPass} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="My Profile" component={MyProfile} />
      <Stack.Screen name="My Bookings" component={MyBooking} />

      <Stack.Screen name="Sd Bookings" component={SdBooking} />
      <Stack.Screen name="Multi SD Live Bookings" component={MultiSdBooking} />
      <Stack.Screen name="Multi Odd Hours Bookings" component={MultiOddBooking} />
      <Stack.Screen name="Multi Bookings AIBA 5to7" component={Aiba5to7} />
      <Stack.Screen name="Odd Hours" component={OddHours} />
      <Stack.Screen name="Sd Hours" component={SdHours} />
      <Stack.Screen name="Book Aiba 5to7" component={BookAiba5to7} />


      <Stack.Screen name="Adv Bookings" component={AdvBooking} />
      <Stack.Screen name="Book Slot" component={BookSlot} />
      <Stack.Screen name="Payment Entry" component={PaymentEntry} />
      <Stack.Screen name="Live" component={Live} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="AboutUs" component={About} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Disclamer" component={Disclamer} />
      <Stack.Screen name="Refund" component={Refund} />
      <Stack.Screen name="Grevience" component={Grevience} />
    </Stack.Navigator>
  );
};
