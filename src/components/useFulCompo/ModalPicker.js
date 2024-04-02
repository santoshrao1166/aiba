import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {height} = Dimensions.get('window');
const ModalPicker = ({
  data,
  placeholder,
  selectedValue,
  setselectedValue,
  defalutValue,
  disabled,
}) => {
  const [openPicker, setopenPicker] = useState(false);
  const [selectedData, setselectedData] = useState({
    label: placeholder ? placeholder : null,
    value: defalutValue ? defalutValue : null,
  });
  //   console.log(data);
  useEffect(() => {
    console.log(selectedData?.label);
  }, [selectedData?.label]);
  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        style={{
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderColor: 'black',
          borderWidth: 0.5,
          paddingHorizontal: 20,
          borderRadius: 10,
        }}
        onPress={() => setopenPicker(true)}>
        <Text style={{fontSize: 16, color: 'rgba(0,0,0,0.5)'}}>
          {selectedData?.label}
        </Text>
        <AntDesign name="caretdown" size={10} color="rgba(0,0,0,0.5)" />
      </TouchableOpacity>
      <ItemModal
        data={data}
        modalVisible={openPicker}
        setModalVisible={setopenPicker}
        setselectedData={setselectedData}
        selectedValue={selectedValue}
        setselectedValue={setselectedValue}
        placeholder={placeholder}
        defalutValue={defalutValue}
        // {...props}
      />
    </View>
  );
};

export default ModalPicker;

const ItemModal = ({
  modalVisible,
  setModalVisible,
  data,
  setselectedData,
  selectedValue,
  setselectedValue,
  defalutValue,
  placeholder,
}) => {
  console.log(data);
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {placeholder ? (
              <TouchableOpacity
                style={{
                  marginVertical: 5,
                  padding: 8,
                }}
                onPress={() => {
                  setselectedData({
                    label: placeholder ? placeholder : null,
                    value: defalutValue ? defalutValue : null,
                  });
                  setModalVisible(false);
                  setselectedValue(
                    defalutValue ? defalutValue : null,
                    setselectedData,
                  );
                }}>
                <Text style={styles.textStyle}>{placeholder}</Text>
              </TouchableOpacity>
            ) : null}
            {data.length ? (
              <FlatList
                data={data}
                renderItem={item => {
                  //   console.log(item);

                  return (
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          selectedValue == item?.item?.value
                            ? 'rgba(0,0,0,0.15)'
                            : 'white',
                        marginVertical: 5,
                        padding: 8,
                      }}
                      onPress={() => {
                        setselectedData({
                          label: item?.item?.label,
                          value: item?.item?.value,
                        });
                        setModalVisible(false);
                        setselectedValue(item?.item?.value, setselectedData);
                      }}>
                      <Text style={styles.textStyle}>{item?.item?.label}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setselectedData({
                    label: placeholder ? placeholder : null,
                    value: defalutValue ? defalutValue : null,
                  });
                  setModalVisible(false);
                  setselectedValue(
                    defalutValue ? defalutValue : null,
                    setselectedData,
                  );
                }}>
                <Text>No item to select.</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    maxHeight: height / 2,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    // elevation: 2,
  },
  textStyle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
