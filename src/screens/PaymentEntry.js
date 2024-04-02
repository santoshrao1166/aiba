import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Footer from '../components/Footer';
import {useDispatch, useSelector} from 'react-redux';
import axios from '../axios';
import {razorpayKeyId} from '../config';
import RazorpayCheckout from 'react-native-razorpay';
import Input from '../components/useFulCompo/Input';
import paymentImage from '../assets/payWithRazorpay.png';
import ModalPicker from '../components/useFulCompo/ModalPicker';
const {height, width} = Dimensions.get('window');
function PaymentEntry({navigation, route}) {
  const colorScheme = useSelector(state => state.theme);

  const [disablePaymentBtn, setdisablePaymentBtn] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [partners, setpartners] = useState([]);
  const [groupDetail, setgroupDetail] = useState({});
  const {date, slot, groupId, plan} = route.params;
  // const [allCategory, setallCategory] = useState([]);
  const [orderData, setorderData] = useState({
    name: '',
    slotType: 'individual',
    partner: '',
    partner_id: '0',
    date: '',
    time: '',
    category_id: '0',
    groupId: '',
    groupName: '',
    memberType: '',
    amount: null,
  });
  const user = useSelector(state => state.user);

  async function getPartners() {
    // get partners of this group
    try {
      let getPartners = await (
        await axios.get(`user/partners_by_groups?group_id=${groupId}`)
      ).data;
      if (getPartners.status == 0) {
        setpartners([]);
        Alert.alert(
          'No user found',
          'You are the only vendor present in this group!!!!',
        );
        return;
      }
      setpartners(getPartners.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // get group detail by group id
    const get = async () => {
      try {
        let data = await axios.get(`user/get_group_by_id?group_id=${groupId}`);
        data = await data.data;
        // console.log(data);
        setgroupDetail(data.data);
        // let ctgData = await axios.get(`user/assigned_categories`);
        // ctgData = await ctgData.data;
        // // console.log(ctgData.data);
        // setallCategory(ctgData.data);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, [groupId]);

  useEffect(() => {
    setorderData(pre => {
      return {
        ...pre,
        plan: plan,
        name: user?.name,
        slotType: 'individual',
        date: `${date?.date}-${date?.month}-${date?.year}`,
        groupId: groupId,
        groupName: groupDetail?.name,
        time: `${slot?.startTime}:00`,
        memberType: 'Member',
        amount: groupDetail?.solo_price,
      };
    });
  }, [
    user?.name,
    date?.date,
    date?.month,
    date?.year,
    slot?.startTime,
    groupId,
    groupDetail?.name,
    groupDetail?.solo_price,
    plan,
  ]);

  const handlePayNow = async () => {
    if (orderData?.name == '') {
      Alert.alert('', "Name field can't be empty");
      return;
    }
    if (toggleCheckBox == false) {
      Alert.alert(
        '',
        'You have to accept the ownership of power users and vendors of filling fields',
      );
      return;
    }
    //disable payment btn
    setdisablePaymentBtn(true);
    let data = new FormData();
    data.append('group_id', groupId);
    data.append('hour', slot?.startTime);
    data.append('date', date?.date);
    data.append('month', date?.month);
    data.append('year', date?.year);
    data.append('slot_type', orderData?.slotType);
    data.append('payment_type', plan);
    data.append('partner_id', parseInt(orderData?.partner_id));
    data.append('accept', 1);
    data.append('payment_status', 'pending');
    // console.log(data);
    switch (plan) {
      case 'free':
        {
          try {
            let freeOrder = await axios.post('user/free_booking', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            freeOrder = await freeOrder.data;
            if (freeOrder.status == -3) {
              Alert.alert('Are you sure', freeOrder?.error, [
                {
                  text: 'Yes',
                  onPress: async () => {
                    data.append('skip_warnings', true);
                    freeOrder = await axios.post('user/free_booking', data, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                    });
                    freeOrder = await freeOrder.data;
                    if (freeOrder.status == 1) {
                      Alert.alert('Slot Booked.', 'Your free slot is booked.');
                      setdisablePaymentBtn(false);
                      navigation.navigate('My Bookings');
                    } else {
                      Alert.alert('Error', freeOrder?.error);
                      navigation.navigate('Book Slot');
                      setdisablePaymentBtn(false);
                      return;
                    }
                  },
                },
                {
                  text: 'No',
                  onPress: () => {
                    navigation.goBack();
                    return;
                  },
                },
              ]);
            } else if (freeOrder?.status == 0) {
              Alert.alert('Slot is Not Available', freeOrder?.error);
              navigation.navigate('Book Slot');
              setdisablePaymentBtn(false);
              return;
            } else if (freeOrder.status == -2) {
              let validationData = freeOrder.validation_array;
              for (let key in validationData) {
                Alert.alert('Please check', validationData[key]);
                setdisablePaymentBtn(false);
                return;
              }
            } else if (freeOrder.status == 1) {
              Alert.alert('Slot Booked.', 'Your free slot is booked.');
              setdisablePaymentBtn(false);
              navigation.navigate('My Bookings');
              return;
            } else {
              Alert.alert('Error', freeOrder?.error);
              navigation.navigate('Book Slot');
              setdisablePaymentBtn(false);
              return;
            }
          } catch (error) {
            setdisablePaymentBtn(false);
            Alert.alert('Error', error);
            console.log('error in craeting order  ->', error);
          }
        }
        break;
      case 'paid':
        {
          try {
            let orderCreation = await axios.post('user/booking_process', data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            orderCreation = await orderCreation.data;
            console.log(orderCreation);
            if (orderCreation.status == -3) {
              Alert.alert('Are you sure', orderCreation?.error, [
                {
                  text: 'Yes',
                  onPress: async () => {
                    data.append('skip_warnings', true);
                    orderCreation = await axios.post(
                      '/user/booking_process',
                      data,
                      {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      },
                    );
                    orderCreation = await orderCreation.data;
                    let options = {
                      description: 'Payment for booking slot',
                      image: 'https://www.aibaonline.in/images/logo_new.png',
                      currency: 'INR',
                      key: orderCreation?.razorpay_key,
                      amount: orderData?.amount * 100,
                      name: 'AIBA',
                      order_id: orderCreation?.razorpayOrderId,
                      theme: {color: '#53a20e'},
                    };
                    RazorpayCheckout.open(options)
                      .then(async response => {
                        // handle success
                        Alert.alert('Payment success', 'Your payment is done.');
                        setdisablePaymentBtn(false);
                        navigation.navigate('My Bookings');
                      })
                      .catch(error => {
                        setdisablePaymentBtn(false);
                        // handle failure
                        console.log('error in craeting order  ->', error);
                        error = JSON.parse(error.description).error.description;
                        Alert.alert('Error', ` ${error}`);
                      });
                  },
                },
                {
                  text: 'No',
                  onPress: () => {
                    navigation.goBack();
                    return;
                  },
                },
              ]);
            } else if (orderCreation?.status == 0) {
              Alert.alert('Slot is Not Available', orderCreation?.error);
              navigation.navigate('Book Slot');
              setdisablePaymentBtn(false);
              return;
            } else if (orderCreation.status == -2) {
              let validationData = orderCreation.validation_array;
              for (let key in validationData) {
                Alert.alert('Please check', validationData[key]);
                setdisablePaymentBtn(false);
                return;
              }
            } else if (orderCreation.status == 1) {
              let options = {
                description: 'Payment for booking slot',
                image: 'https://www.aibaonline.in/images/logo_new.png',
                currency: 'INR',
                key: orderCreation?.razorpay_key,
                amount: orderData?.amount * 100,
                name: 'AIBA',
                order_id: orderCreation?.razorpayOrderId,
                theme: {color: '#53a20e'},
              };
              RazorpayCheckout.open(options)
                .then(async response => {
                  // handle success
                  Alert.alert('Payment success', 'Your payment is done.');
                  setdisablePaymentBtn(false);
                  navigation.navigate('My Bookings');
                })
                .catch(error => {
                  setdisablePaymentBtn(false);
                  // handle failure
                  console.log('error in craeting order  ->', error);
                  error = JSON.parse(error.description).error.description;
                  Alert.alert('Error', ` ${error}`);
                });
            } else {
              Alert.alert('Error', orderCreation?.error);
              navigation.navigate('Book Slot');
              setdisablePaymentBtn(false);
              return;
            }
          } catch (error) {
            setdisablePaymentBtn(false);
            Alert.alert('Error', error);
            console.log('error in craeting order  ->', error);
          }
        }

        break;

      default:
        navigation.navigate('Book Slot');
        break;
    }

    console.log('end');
  };

  const handlePayLater = async () => {
    if (orderData?.name == '') {
      Alert.alert('', "Name field can't be empty");
      return;
    }
    if (toggleCheckBox == false) {
      Alert.alert(
        '',
        'You have to accept the ownership of power users and vendors of filling fields',
      );
      return;
    }
    //disable payment btn
    setdisablePaymentBtn(true);

    try {
      let data = new FormData();
      data.append('group_id', groupId);
      data.append('hour', slot?.startTime);
      data.append('date', date?.date);
      data.append('month', date?.month);
      data.append('year', date?.year);
      data.append('payment_type', 'paid');
      data.append('slot_type', orderData?.slotType);
      data.append('partner_id', orderData?.partner_id);
      data.append('accept', 1);
      data.append('payment_status', 'pay_later');

      let orderCreation = await axios.post('user/booking_process', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      orderCreation = await orderCreation.data;
      console.log(orderCreation);
      if (orderCreation.status == -3) {
        Alert.alert('Are you sure', orderCreation?.message, [
          {
            text: 'Yes',
            onPress: async () => {
              data.append('skip_warnings', true);
              orderCreation = await axios.post('/user/booking_process', data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              orderCreation = await orderCreation.data;
              let paylaterData = new FormData();
              paylaterData.append('booking_id', orderCreation.booking_id);
              paylaterData.append('amount', orderCreation.amount);
              let payLaterRes = await axios.post(
                'user/booking_paylater',
                paylaterData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                },
              );
              payLaterRes = await payLaterRes.data;
              if (payLaterRes?.status) {
                Alert.alert(
                  'Booking Successful',
                  'Your booking is done, but you must have to make payment for your booking atleast 24 hour before the slot.',
                );
                navigation.navigate('My Bookings');
                setdisablePaymentBtn(false);
              } else {
                Alert.alert('Booking Failed', payLaterRes?.error);
              }
            },
          },
          {
            text: 'No',
            onPress: () => {
              navigation.goBack();
              return;
            },
          },
        ]);
      } else if (orderCreation?.status == 0) {
        Alert.alert('Slot is Not Available', orderCreation?.error);
        navigation.navigate('Book Slot');
        setdisablePaymentBtn(false);
        return;
      } else if (orderCreation.status == -2) {
        let validationData = orderCreation.validation_array;
        for (let key in validationData) {
          Alert.alert('Please check', validationData[key]);
          setdisablePaymentBtn(false);
          return;
        }
      } else if (orderCreation.status == 1) {
        let paylaterData = new FormData();
        paylaterData.append('booking_id', orderCreation.booking_id);
        paylaterData.append('amount', orderCreation.amount);
        let payLaterRes = await axios.post(
          'user/booking_paylater',
          paylaterData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        payLaterRes = await payLaterRes.data;
        if (payLaterRes?.status) {
          Alert.alert(
            'Booking Successful',
            'Your booking is done, but must have to make payment from your booing page before the slot date.',
          );
          navigation.navigate('My Bookings');
          setdisablePaymentBtn(false);
        } else {
          Alert.alert('Booking Failed', payLaterRes?.error);
          setdisablePaymentBtn(false);
        }
      }
    } catch (error) {
      error = JSON.parse(error.description).error.description;
      Alert.alert('Payment Canceled', ` ${error}`);
      console.log('error in craeting order  ->', error);
    }
    setTimeout(() => {
      setdisablePaymentBtn(false);
    }, 6000);
  };

  return (
    <>
      <ScrollView backgroundColor="white">
        <Header isAuth navigation={navigation} />

        <View style={{marginHorizontal: width * 0.1, flex: 1}}>
          {/* top arrow and text  */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back-ios" size={25} />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                marginRight: 25,
              }}>
              <View
                style={{
                  borderBottomColor: '#FF9330',
                  borderBottomWidth: 3,
                  borderbottomStyle: 'solid',
                  marginLeft: 20,
                  paddingHorizontal: 20,
                }}>
                <Text
                  style={{fontSize: 20, fontWeight: '700', paddingBottom: 7}}>
                  Payment Entry
                </Text>
              </View>
            </View>
          </View>
          {/* name  */}
          <Input
            label="Name"
            required
            value={orderData?.name}
            onChangeText={val => {
              setorderData(pre => {
                return {...pre, name: val};
              });
            }}
            placeholder="Name"
          />
          {/* plan  */}
          <Input
            label="Plan"
            required
            value={plan}
            placeholder="Name"
            editable={false}
          />

          {/* slot type */}
          <View>
            <View style={styles.inputMainView}>
              <Text style={styles.label}>Slot Type</Text>
              <Entypo name="star" size={8} color="red" />
            </View>
            <View style={styles.pickerBorder}>
              <Picker
                mode="dropdown"
                style={{color: 'rgba(0,0,0,0.5)'}}
                selectedValue={orderData?.slotType}
                onValueChange={val => {
                  setorderData(pre => {
                    return {
                      ...pre,
                      slotType: val,
                      amount:
                        val == 'individual'
                          ? groupDetail?.solo_price
                          : groupDetail?.group_price,
                    };
                  });

                  if (val != 'individual') {
                    getPartners();
                  }
                }}>
                <Picker.Item
                  label="Solo"
                  color={
                    colorScheme == 'dark'
                      ? Platform.OS == 'ios'
                        ? 'black'
                        : 'white'
                      : 'black'
                  }
                  value="individual"
                />
                {groupDetail?.group_type == 'odd' ||
                groupDetail?.group_type == 'sd' ? null : (
                  <Picker.Item
                    label="Partner"
                    color={
                      colorScheme == 'dark'
                        ? Platform.OS == 'ios'
                          ? 'black'
                          : 'white'
                        : 'black'
                    }
                    value="partner"
                  />
                )}
              </Picker>
            </View>
          </View>

          {/* select a partner  */}
          {orderData?.slotType == 'partner' ? (
            <>
              <Text style={{color: 'rgba(0,0,0,0.4)'}}>
                (You need to pay for your partner and take the respective
                sharing half amt from your partner directly)
              </Text>
              <View>
                <View style={styles.inputMainView}>
                  <Text style={styles.label}>Select Partner</Text>
                </View>
                <View style={styles.pickerBorder}>
                  {/* <ModalPicker
                    data={partners}
                    placeholder="Select Partner later"
                    defalutValue="0"
                    selectedValue={orderData?.partner_id}
                    setselectedValue={val => {
                      console.log(val);
                      setorderData(pre => {
                        return {...pre, partner_id: val};
                      });
                    }}
                  /> */}
                  <Picker
                    style={{color: 'rgba(0,0,0,0.5)'}}
                    selectedValue={orderData?.partner_id}
                    onValueChange={val => {
                      setorderData(pre => {
                        return {...pre, partner_id: val};
                      });
                    }}>
                    <Picker.Item
                      label="Select Partner later"
                      color={
                        colorScheme == 'dark'
                          ? Platform.OS == 'ios'
                            ? 'black'
                            : 'white'
                          : 'black'
                      }
                      value="0"
                    />
                    {partners.length ? (
                      partners.map((partner, i) => (
                        <Picker.Item
                          key={i}
                          color={
                            colorScheme == 'dark'
                              ? Platform.OS == 'ios'
                                ? 'black'
                                : 'white'
                              : 'black'
                          }
                          label={partner?.name}
                          value={partner?.id}
                        />
                      ))
                    ) : (
                      <Picker.Item
                        label="You have no partners to select"
                        color={
                          colorScheme == 'dark'
                            ? Platform.OS == 'ios'
                              ? 'black'
                              : 'white'
                            : 'black'
                        }
                        value="0"
                      />
                    )}
                  </Picker>
                </View>
              </View>
            </>
          ) : null}

          {/* select a category  */}

          {/* <View>
            <View style={styles.inputMainView}>
              <Text style={styles.label}>Select categories</Text>
            </View>
            <View style={styles.pickerBorder}>
              <Picker
                style={{color: 'rgba(0,0,0,0.5)'}}
                selectedValue={orderData?.category_id}
                onValueChange={val => {
                  setorderData(pre => {
                    return {...pre, category_id: val};
                  });
                }}>
                <Picker.Item
                  label="Select a category"
                  color={
                    colorScheme == 'dark'
                      ? Platform.OS == 'ios'
                        ? 'black'
                        : 'white'
                      : 'black'
                  }
                  value="0"
                />
                {allCategory.length ? (
                  allCategory.map((partner, i) => (
                    <Picker.Item
                      key={i}
                      color={
                        colorScheme == 'dark'
                          ? Platform.OS == 'ios'
                            ? 'black'
                            : 'white'
                          : 'black'
                      }
                      label={partner?.name}
                      value={partner?.id}
                    />
                  ))
                ) : (
                  <Picker.Item
                    label="You have no category to select"
                    color={
                      colorScheme == 'dark'
                        ? Platform.OS == 'ios'
                          ? 'black'
                          : 'white'
                        : 'black'
                    }
                    value="0"
                  />
                )}
              </Picker>
            </View>
          </View> */}
          {/* date  */}
          <Input
            label="Date"
            required
            value={orderData?.date}
            editable={false}
            placeholder="Date"
            style={{color: 'rgba(0,0,0,0.5)'}}
          />

          {/* time  */}
          <Input
            label="Time"
            required
            value={orderData?.time}
            editable={false}
            placeholder="Date"
            style={{color: 'rgba(0,0,0,0.5)'}}
          />

          {/* order summury */}
          <View style={styles.summaryView}>
            <Text style={{marginVertical: 10, fontSize: 20, fontWeight: '700'}}>
              Order Summary
            </Text>

            <View style={styles.summaryDataMainView}>
              <Text style={styles.summaryDataLeft}>Item Total </Text>
              <Text style={styles.summaryDataRight}>
                Rs. {orderData?.amount}/-
              </Text>
            </View>

            <View style={styles.summaryDataMainView}>
              <Text style={styles.summaryDataLeft}>Page </Text>
              <Text style={styles.summaryDataRight}>{groupDetail?.name}</Text>
            </View>

            <View style={styles.summaryDataMainView}>
              <Text style={styles.summaryDataLeft}>Slot Time </Text>
              <Text style={styles.summaryDataRight}>{orderData?.time}</Text>
            </View>

            <View style={styles.summaryDataMainView}>
              <Text style={styles.summaryDataLeft}>Slot Date </Text>
              <Text style={styles.summaryDataRight}>{orderData?.date}</Text>
            </View>

            <View style={styles.summaryDataMainView}>
              <Text style={styles.summaryDataLeft}>Slot Type </Text>
              <Text style={styles.summaryDataRight}>
                {orderData?.slotType == 'partner' ? 'Partner' : 'Solo'}
              </Text>
            </View>

            <View style={styles.summaryDataMainView}>
              <Text style={styles.summaryDataLeft}>Payment Mode </Text>
              {/* <Text style={styles.summaryDataRight}>Pay with Razorpay </Text> */}
            </View>

            <Image
              source={paymentImage}
              style={{width: 200, height: 160}}
              resizeMode="contain"
            />
          </View>

          {/* check box for accept terms */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              tintColors={{true: '#FF9330', false: '#787885'}}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
            <Text style={{margin: 8, fontSize: 10}}>
              I agree to the terms and conditions of the page. If not paid on
              time, my slot will be released 1 day prior at 6pm.
            </Text>
          </View>

          {/* payment buttons  */}
          <View
            style={{
              marginVertical: 40,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={handlePayNow}
              disabled={disablePaymentBtn}
              style={styles.paymentBtnTouchable}>
              {disablePaymentBtn ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.paymentbtnText}>
                  {plan != 'free' ? 'Pay Now' : 'Book Now'}
                </Text>
              )}
            </TouchableOpacity>

            {/* paylater is slot type is partner  */}
            {plan != 'free' && orderData?.slotType == 'partner' ? (
              <TouchableOpacity
                onPress={handlePayLater}
                disabled={disablePaymentBtn}
                style={styles.paymentBtnTouchable}>
                {disablePaymentBtn ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.paymentbtnText}>Pay Later</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <Footer />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  inputMainView: {flexDirection: 'row', marginTop: 20},
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  pickerBorder: {
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  summaryView: {
    backgroundColor: '#e9e9e97d',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  summaryDataMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 6,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  summaryDataLeft: {fontSize: 15, fontWeight: '700'},
  summaryDataRight: {fontSize: 15, fontWeight: '400'},
  paymentBtnTouchable: {
    backgroundColor: '#FF9330',
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: 180,
  },
  paymentbtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
export default PaymentEntry;
