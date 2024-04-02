import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { weekDays, months } from '../importantFeatures';
import axios from 'axios';
import { serverEndPoint } from '../config';
const { height, width } = Dimensions.get('window');

function TimeSlotBar({
  header,
  leftContent,
  rightContent,
  date,
  groupId,
  soloPrice,
  slot,
  navigation,
  plan,
  onAddDetails,
  onAddSlots,
  multi
}) {
  const bottomSheet = useRef();
  const [isHistory, setisHistory] = useState(false);
  const notAvail = rightContent == 'Available' ? false : true;
  const [selected, setselected] = useState(false);
  useEffect(() => {
    const check = () => {
      let currentDate = new Date();
      let d = {
        date: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        hour: currentDate.getHours(),
      };

      if (date?.year < d.year) {
        setisHistory(true);
        return;
      }
      if (date?.year > d.year) {
        setisHistory(false);
        return;
      }
      if (date?.month < d.month) {
        setisHistory(true);
        return;
      }
      if (date?.month > d.month) {
        setisHistory(false);
        return;
      }
      if (date?.date < d.date) {
        setisHistory(true);
        return;
      }
      if (date?.date >= d.date) {
        setisHistory(false);
        return;
      }
      if (d.hour >= slot?.startTime) {
        setisHistory(true);
        return;
      }
      setisHistory(false);
    };
    check();
    let interval = setInterval(() => getCartDetail(groupId), 1000);
    return ()=>{clearInterval(interval);}
  }, [date?.year, date?.month, date?.date, slot?.startTime]);

  const getCartDetail = async (groupId) =>{
    try {
      let response = await axios.get(
        serverEndPoint + 'user/cart_data?group_id=' + groupId,
      );
      cartData = await response.data;
      onAddDetails(cartData)
    } catch (error) {
      // console.log(error, '+++++');
    }
  }
  const onAddSlot= async(date,
    slot,
    groupId,
    soloPrice,
    plan)=>{
    try {
      let data = new FormData();
      data.append('hour', slot?.startTime);
      data.append('date', date?.date);
      data.append('month', date?.month);
      data.append('year', date?.year);
      data.append('page_id', groupId);
      data.append('amount', soloPrice);
      data.append('type', plan);
      let orderData = await axios.post(serverEndPoint + 'user/add_cart_multi_booking', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      orderData = await orderData.data;
      if(orderData.status == 1)
      {
        onAddSlots();
        getCartDetail(groupId)
      }
    } catch (error) {
      console.log('error in craeting order  ->', error);
    }
    // setdisablePaymentBtn(false);
  }

  return (
    <>
      {isHistory ? null : (
        <Pressable
          onPress={
            notAvail
              ? null
              : () => {
                bottomSheet.current.open();
                setselected(true);
              }
          }>
          <View
            style={{
              width: width * 0.9,
              height: 45,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: header
                ? '#FF9432'
                : notAvail
                  ? '#E5E5E5'
                  : selected
                    ? '#FF5C00'
                    : '#FFEDDD',
            }}>
            <View
              style={{
                height: 45,
                width: width * 0.27,
                borderRightColor: 'white',
                borderRightWidth: 5,
                ...styles.centerItem,
              }}>
              <Text
                style={{
                  ...styles.centeredText,
                  color: header
                    ? 'white'
                    : notAvail
                      ? '#C4C4C4'
                      : selected
                        ? 'white'
                        : 'black',
                }}>
                {leftContent}
              </Text>
            </View>
            <View
              style={{ width: width * 0.63, height: 45, ...styles.centerItem }}>
              <Text
                style={{
                  ...styles.centeredText,
                  color: header
                    ? 'white'
                    : notAvail
                      ? '#C4C4C4'
                      : selected
                        ? 'white'
                        : 'black',
                }}>
                {rightContent}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
      {/* bottom sheet is here */}
      <RBSheet
        ref={bottomSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={150}
        onClose={() => {
          setselected(false);
        }}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <View style={styles.rbSheetView}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '400', marginBottom: 3 }}>
              {`${weekDays[date?.day]},   ${date?.date} ${months[date?.month]
                } ${date?.year}`}
            </Text>
            <Text style={{ fontSize: 19, fontWeight: '400', color: '#787885' }}>
              {`${slot?.time} to ${parseInt(slot?.endtime) > 12
                  ? parseInt(slot?.endtime) - 12
                  : parseInt(slot?.endtime)
                } ${slot?.endtime <= 12 ? 'AM' : 'PM'} `}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
                (multi)?
              onAddSlot(date,
                slot,
                groupId,
                soloPrice,
                plan):
              navigation.navigate('Payment Entry', {
                date,
                slot,
                groupId,
                plan,
              });
              setselected(false);
              bottomSheet.current.close();
            }}
            style={styles.rbSheetTachable}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>{(multi)?'Add Slot':'Confirm Slot'}</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </>
  );
}

const styles = StyleSheet.create({
  centerItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: { fontSize: 15, fontWeight: '600' },
  rbSheetView: {
    marginHorizontal: width * 0.05,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rbSheetTachable: {
    backgroundColor: '#FFB800',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

export default TimeSlotBar;
