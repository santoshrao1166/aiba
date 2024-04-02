import React, {useRef} from 'react';
import {Dimensions, ScrollView, View, StyleSheet} from 'react-native';
import MultipleSelect from 'react-native-multiple-select';

const {height, width} = Dimensions.get('window');

const MultiSelect = ({
  items,
  onSelectedItemsChange,
  selectedItems,
  selectText,
  searchInputPlaceholderText,
}) => {
  const multiSelectRef = useRef(null);

  return (
    <ScrollView horizontal style={styles.pickerBorder}>
      <View
        style={{
          width: width * 0.7,
          marginRight: 10,
        }}>
        <MultipleSelect
          ref={multiSelectRef}
          items={items}
          uniqueKey="id"
          onSelectedItemsChange={onSelectedItemsChange}
          selectText={selectText ? selectText : 'Select categories'}
          searchInputPlaceholderText={
            searchInputPlaceholderText
              ? searchInputPlaceholderText
              : 'Search categories'
          }
          selectedItems={selectedItems}
          tagRemoveIconColor="#FF9330"
          tagBorderColor="#FF9330"
          tagTextColor="#000000"
          selectedItemTextColor="#FF9330"
          selectedItemIconColor="#FF9330"
          submitButtonColor="#FF9330"
          submitButtonText="Selected"
        />
      </View>
    </ScrollView>
  );
};

export default MultiSelect;

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
    borderRadius: 10,

    // elevation: 3,
  },
  pickerBorder: {
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 15,
  },
  checkBox: {
    color: 'white',
  },
});
