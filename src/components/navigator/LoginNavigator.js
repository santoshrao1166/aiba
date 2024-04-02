import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../screens/Login';
import ForgetPass from '../../screens/ForgetPass';
import ForgetPass2 from '../../screens/ForgetPass2';

const Stack = createStackNavigator();

export default function LoginNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginHome" component={Login} />
      <Stack.Screen name="ForgetPass" component={ForgetPass} />
      <Stack.Screen name="ForgetPass2" component={ForgetPass2} />
    </Stack.Navigator>
  );
}
