import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

function SlotDate({selected, day, date, setSeletedDate, wholeDateObj}) {
  return (
    <TouchableOpacity
      onPress={() => {
        setSeletedDate(wholeDateObj);
      }}>
      <View
        style={{
          marginRight: 10,
          width: 60,
          height: 60,
          borderRadius: 5,
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          marginVertical: 10,
          borderColor: selected ? '#FF9330' : '#333333',
          borderWidth: 1,
          borderStyle: 'solid',
        }}>
        <Text
          style={{
            marginTop: 5,
            fontSize: 12,
            letterSpacing: 2,
            fontWeight: '700',
            color: selected ? '#FF9330' : '#333333',
          }}>
          {day}
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 18,
            letterSpacing: 2,
            fontWeight: '700',
            color: selected ? '#FF9330' : '#7A7585',
          }}>
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default SlotDate;
