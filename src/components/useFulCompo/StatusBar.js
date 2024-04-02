import React from 'react';
import {StyleSheet, Platform, StatusBar, View} from 'react-native';
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 30 : StatusBar.currentHeight;

function StatusBar1({backgroundColor, ...props}) {
  return (
    <View style={[styles.statusBar, {backgroundColor}]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

export default StatusBar1;
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
