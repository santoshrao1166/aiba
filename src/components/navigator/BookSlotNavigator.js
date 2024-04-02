import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BookSlot from '../../screens/BookSlot';
import PaymentEntry from '../../screens/PaymentEntry';

const Stack = createStackNavigator();

export default function BookSlotNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Book SlotHome"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Book SlotHome" component={BookSlot} />
      <Stack.Screen name="Payment Entry" component={PaymentEntry} />
    </Stack.Navigator>
  );
}
