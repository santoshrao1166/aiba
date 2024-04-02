import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
const {height, width} = Dimensions.get('window');

const Input = props => {
  // const [isFocus, setisFocus] = useState(false);
  let {label, required, value, onChangeText, style, massageForInput} = props;

  return (
    <View>
      <View style={styles.inputMainView}>
        <Text style={styles.label}>{label}</Text>
        {required ? <Entypo name="star" size={8} color="red" /> : null}
      </View>
      <TextInput
        value={value}
        placeholderTextColor="rgba(0,0,0,0.3)"
        // onBlur={() => {
        //   setisFocus(false);
        // }}
        // onFocus={() => {
        //   setisFocus(true);
        // }}
        // onChangeText={onChangeText}
        {...props}
        style={{
          ...styles.textInput,
          ...style,
          // borderColor: isFocus ? '#FF9432' : 'rgba(0,0,0,0.6)',
        }}
      />

      {massageForInput ? (
        <Text
          style={{
            fontSize: 10,
            color: 'blue',
            marginTop: 2,
          }}>
          ( {massageForInput} )
        </Text>
      ) : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputMainView: {
    flexDirection: 'row',
    marginTop: 20,
    color: 'black',
    width: width * 0.4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : null,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderStyle: 'solid',
    // shadowColor: 'black',
    // shadowOpacity: 0.5,
    // shadowOffset: {
    //   width: 2,
    //   height: 3,
    // },
    // shadowRadius: 2,
    color: 'rgba(0,0,0,0.7)',
  },
});
