import React, {cloneElement} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';

const PickerCompo = ({
  data,
  required,
  selectedValue,
  onValueChange,
  Placeholder,
  noDataMassage,
  itemNotAvailableText,
  showLabel,
  mode,
}) => {
  const colorScheme = useSelector(state => state.theme);
  return (
    <View>
      {showLabel || required ? (
        <View style={styles.inputMainView}>
          {showLabel ? <Text style={styles.label}>{showLabel}</Text> : null}
          {required ? <Entypo name="star" size={8} color="red" /> : null}
        </View>
      ) : null}

      <View style={styles.pickerBorder}>
        <Picker
          mode={mode ? mode : 'dialog'}
          style={{color: 'rgba(0,0,0,0.5)', backgroundColor: 'white'}}
          selectedValue={selectedValue}
          onValueChange={onValueChange}>
          {Placeholder ? (
            <Picker.Item
              color={
                colorScheme == 'dark'
                  ? Platform.OS == 'ios'
                    ? 'black'
                    : 'white'
                  : 'black'
              }
              label={Placeholder}
              value=""
            />
          ) : null}
          {data?.length ? (
            data?.map((d, i) => (
              <Picker.Item
                key={i}
                color={
                  colorScheme == 'dark'
                    ? Platform.OS == 'ios'
                      ? d.disable
                        ? 'rgba(0,0,0,0.6)'
                        : 'black'
                      : 'white'
                    : d.disable
                    ? 'rgba(0,0,0,0.6)'
                    : 'black'
                }
                label={
                  d.label +
                  `${
                    d.disable
                      ? itemNotAvailableText
                        ? ` ( ${itemNotAvailableText}) `
                        : '  (Not available)'
                      : ''
                  }`
                }
                value={d.value}
              />
            ))
          ) : (
            <Picker.Item
              label={noDataMassage}
              value=""
              color={
                colorScheme == 'dark'
                  ? Platform.OS == 'ios'
                    ? 'black'
                    : 'white'
                  : 'black'
              }
            />
          )}
        </Picker>
      </View>
    </View>
  );
};

export default PickerCompo;

const styles = StyleSheet.create({
  inputMainView: {
    flexDirection: 'row',
    marginTop: 20,
    color: 'black',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    paddingHorizontal: 15,
    paddingHorizontal: Platform.OS === 'ios' ? 15 : 0,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderStyle: 'solid',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 2,
    color: '#8f9194',
  },
  pickerBorder:
    Platform.OS == 'ios'
      ? {
          backgroundColor: 'white',
          borderRadius: 10,
          paddingHorizontal: 15,
        }
      : {
          borderColor: 'rgba(0,0,0,0.3)',
          borderWidth: 1,
          borderStyle: 'solid',
          backgroundColor: 'white',
          borderRadius: 10,
          paddingHorizontal: 15,
        },
  checkBox: {
    color: 'white',
  },
});
