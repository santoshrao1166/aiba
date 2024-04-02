import React, {useEffect, useRef} from 'react';
// import {NetInfo, Platform} from 'react-native'
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
// //importing redux module to managing state
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {allReducer} from './redux/reducer';
import MainNavigator from './components/navigator/MainNavigato';
import StatusBar from './components/useFulCompo/StatusBar';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const {width, height} = Dimensions.get('window');
const myStore = createStore(allReducer);
const App = () => {
  const netConnection = useNetInfo();

  ///////////////////////////////////////////////////
  // check for internet connection
  ///////////////////////////////////////////////////

  return (
    <Provider store={myStore}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {netConnection?.isConnected ? (
        <MainNavigator />
      ) : (
        <>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: width,
              height: height,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 25,
                fontWeight: '700',
                marginVertical: 10,
              }}>
              AIBA
            </Text>
            <ActivityIndicator size="large" />
            <Text
              style={{textAlign: 'center', fontSize: 16, marginVertical: 20}}>
              OOPS SOMETHING WENT WRONG{'\n'}
              PLEASE CHECK YOUR NETWORK CONNECTION
            </Text>
          </View>
        </>
      )}
    </Provider>
  );
};

export default App;
