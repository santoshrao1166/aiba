import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import VendorRegistration from '../../screens/VendorRegistration';
import Terms from '../../screens/termsScreens/Terms';

const Stack = createStackNavigator();

function VendorRegistrationNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Vendor RegistrationHome"
        component={VendorRegistration}
      />
      <Stack.Screen name="Terms" component={Terms} />
    </Stack.Navigator>
  );
}

export default VendorRegistrationNavigator;
