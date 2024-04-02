import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  Linking,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import {months, ValidURL} from '../importantFeatures';
import {razorpayKeyId, serverEndPoint} from '../config';
import axios, {axiosGet} from '../axios';
import RazorpayCheckout from 'react-native-razorpay';
import Buffer from 'buffer';
import Input from './useFulCompo/Input';
import {useDispatch} from 'react-redux';
import ModalPicker from './useFulCompo/ModalPicker';

const buffer = Buffer.Buffer;
const {height, width} = Dimensions.get('window');

function BookingDetails({booking, history, getBookings, navigation, other}) {
  const [paid, setpaid] = useState(false);
  const [partner, setpartner] = useState(false);
  const [disablePaymentBtn, setdisablePaymentBtn] = useState(false);
  const [selectedPartner, setselectedPartner] = useState('0');
  const [partners, setpartners] = useState([]);
  const [showAddLinkModal, setshowAddLinkModal] = useState(false);
  const dispatch = useDispatch();
  async function getPartners() {
    // get partners of this group
    axiosGet(
      `user/partners_by_groups?group_id=${booking?.group_id}`,
      data => {
        setpartners(
          data.map(d => {
            return {name: d.name, id: d.id, label: d.name, value: d.id};
          }),
        );
      },
      null,
      navigation,
      dispatch,
    );
  }
  useEffect(() => {
    setpaid(booking?.payment_status == 'success' ? true : false);
    if (booking?.slotType == 'individual') {
      setpartner(false);
    } else {
      setpartner(true);
      getPartners();
    }
  }, [booking?.payment_status, booking?.partner_id]);

  //pay now handler
  const handlePayNow = async () => {
    //disable payment btn
    setdisablePaymentBtn(true);
    try {
      let data = new FormData();
      data.append('booking_id', booking?.id);
      data.append('amount', booking?.amount);

      let orderData = await axios.post('user/genrate_payment_order', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      orderData = await orderData.data;
      // console.log(orderData);

      if (orderData?.status == -3) {
        Alert.alert('Are you sure', orderCreation?.message, [
          {
            text: 'Yes',
            onPress: async () => {
              let options = {
                description: 'Payment for booking slot',
                image: 'https://www.aibaonline.in/images/logo_new.png',
                currency: 'INR',
                key: orderData?.razorpay_key,
                amount: orderData?.amount * 100,
                name: 'AIBA',
                order_id: orderData?.razorpayOrderId,
                theme: {color: '#53a20e'},
              };

              RazorpayCheckout.open(options)
                .then(async response => {
                  setdisablePaymentBtn(false);
                  Alert.alert(
                    'Payment Successful',
                    'Congratulations your payment is done.',
                  );
                  getBookings();
                  // handle success
                  // try {
                  //   let confirmPayment = new FormData();
                  //   confirmPayment.append('booking_id', orderData?.booking_id);
                  //   confirmPayment.append('amount', orderData?.amount);
                  //   confirmPayment.append(
                  //     'razorpay_signature',
                  //     response?.razorpay_signature,
                  //   );
                  //   confirmPayment.append(
                  //     'razorpay_order_id',
                  //     response?.razorpay_order_id,
                  //   );
                  //   confirmPayment.append(
                  //     'razorpay_payment_id',
                  //     response?.razorpay_payment_id,
                  //   );
                  //   confirmPayment.append('payment_status', 'success');
                  //   confirmPayment.append('pay_later', 0);
                  //   let saveData = await axios.post(
                  //     'user/razor_pay_order_pay_later',
                  //     confirmPayment,
                  //     {
                  //       headers: {
                  //         'Content-Type': 'multipart/form-data',
                  //       },
                  //     },
                  //   );
                  //   saveData = await saveData.data;
                  //   console.log(saveData);
                  //   setdisablePaymentBtn(false);

                  //   if (saveData.status == 1) {
                  //     Alert.alert(
                  //       'Payment Successful',
                  //       'Congratulations your payment is done.',
                  //     );
                  //     getBookings();
                  //   } else {
                  //     Alert.alert('booking Failed', saveData?.error);
                  //   }
                  // } catch (error) {
                  //   setdisablePaymentBtn(false);
                  //   console.log('error in webhook.....----->', error);
                  // }
                })
                .catch(error => {
                  // handle failure
                  setdisablePaymentBtn(false);
                  error = JSON.parse(error.description).error.description;
                  Alert.alert('Payment Canceled', ` ${error}`);
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
      } else if (orderData?.status == 0) {
        Alert.alert('Slot is Not Available', orderData?.error);
        setdisablePaymentBtn(false);
        return;
      } else if (orderData.status == -2) {
        let validationData = orderData.validation_array;
        for (let key in validationData) {
          Alert.alert('Please check', validationData[key]);
          setdisablePaymentBtn(false);
          return;
        }
      } else if (orderData?.status == 1) {
        let options = {
          description: 'Payment for booking slot',
          image: 'https://www.aibaonline.in/images/logo_new.png',
          currency: 'INR',
          key: orderData?.razorpay_key,
          amount: orderData?.amount * 100,
          name: 'AIBA',
          order_id: orderData?.razorpayOrderId,
          theme: {color: '#53a20e'},
        };

        RazorpayCheckout.open(options)
          .then(async response => {
            setdisablePaymentBtn(false);
            Alert.alert(
              'Payment Successful',
              'Congratulations your payment is done.',
            );
            getBookings();
          })
          .catch(error => {
            // handle failure
            setdisablePaymentBtn(false);
            error = JSON.parse(error.description).error.description;
            Alert.alert('Payment Canceled', ` ${error}`);
          });
      } else {
        Alert.alert('Error', orderData?.error);
        setdisablePaymentBtn(false);
        return;
      }
    } catch (error) {
      console.log('error in craeting order  ->', error);
    }
    setdisablePaymentBtn(false);
  };

  const getInvoice = () => {
    let invNum = booking?.invoice_no;
    if (invNum) {
      let invBase64 = buffer.from(invNum).toString('base64');
      // console.log(invBase64);
      let invUrl = `${serverEndPoint}user/booking_invoice/${invBase64}`;
      // historyDownload(invUrl);
      console.log(invUrl);
      Linking.openURL(invUrl);
    }
  };
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'rgba(0,0,0,0.25)',
        borderBottomWidth: 0.86,
        backgroundColor:
          booking?.payment_status == 'cancelled'
            ? 'rgba(256,0,0,0.5)'
            : 'white',
      }}>
      <View style={{width: 100}}>
        <Text style={{textAlign: 'center'}}>{`${months[booking?.month]} ${
          booking?.date
        }`}</Text>
      </View>
      <View style={{width: 100}}>
        <Text style={{textAlign: 'center'}}>{booking?.hour}:00</Text>
      </View>
      <View style={{width: 120}}>
        <Text style={{textAlign: 'center'}} numberOfLines={2}>
          {booking?.group_name}
        </Text>
      </View>
      <View style={{width: 100}}>
        <Text style={{textAlign: 'center'}}>{booking?.payment_type}</Text>
      </View>
      <View style={{width: 100}}>
        <Text style={{textAlign: 'center'}}>
          {booking?.slot_type == 'individual' ? 'Solo' : 'Partner'}
        </Text>
      </View>
      <View style={{width: 120}} numberOfLines={2}>
        <Text style={{textAlign: 'center'}}>
          {booking?.slot_type != 'individual' &&
          booking?.payment_status != 'cancelled' ? (
            booking?.partner_id == null ? (
              <View>
                <ModalPicker
                  data={partners}
                  placeholder="Select later"
                  defalutValue="0"
                  selectedValue={selectedPartner}
                  setselectedValue={(val, setselectedData) => {
                    setselectedPartner(val);
                    if (val == 0) {
                      return;
                    }
                    Alert.alert(
                      'Are You Sure',
                      'Once you select your partner after that you cannot change.',
                      [
                        {
                          text: 'No',
                          onPress: () => {
                            setselectedPartner('0');
                            setselectedData({
                              label: 'Select later',
                              value: '0',
                            });
                          },
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: async () => {
                            const data = new FormData();
                            data.append('partner_id', val);
                            data.append('booking_id', booking?.id);
                            // console.log(data);
                            try {
                              let updatePartner = await axios.post(
                                'user/update_booking_partner',
                                data,
                                {
                                  headers: {
                                    'Content-Type': 'multipart/form-data',
                                  },
                                },
                              );
                              updatePartner = updatePartner.data;
                              // console.log(updatePartner);
                              if (updatePartner.status == 1) {
                                Alert.alert(
                                  'Partner Selected',
                                  updatePartner?.message,
                                );
                                getBookings();
                              } else {
                                Alert.alert(
                                  'Partner Selecton Failed',
                                  updatePartner?.error,
                                );
                              }
                            } catch (error) {
                              Alert.alert(error);
                            }
                          },
                        },
                      ],
                    );
                  }}
                />
              </View>
            ) : (
              booking?.partner_name
            )
          ) : (
            <Text>-</Text>
          )}
        </Text>
      </View>
      <View style={{width: 100}}>
        <Text style={{textAlign: 'center'}}>
          {booking?.payment_type == 'free' ? null : (
            <FontAwesome name="rupee" size={13} />
          )}{' '}
          {booking?.payment_type == 'free' ? 'Free booking' : booking?.amount}
        </Text>
      </View>
      <View
        style={{width: 100, justifyContent: 'center', flexDirection: 'row'}}>
        <Text
          style={{
            backgroundColor:
              // booking?.payment_type == 'free'
              //   ? 'green' :
              booking?.payment_status == 'success'
                ? 'green'
                : booking?.payment_status == 'pay_later' ||
                  booking?.payment_status == 'pending' ||
                  booking?.payment_status == 'failed'
                ? 'orange'
                : booking?.payment_status == 'cancelled'
                ? 'red'
                : 'green',
            color: 'white',
            padding: 5,
            borderRadius: 5,
          }}>
          {booking?.payment_status}
        </Text>
      </View>

      {history ? null : (
        <>
          <View
            style={{
              width: 100,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            {booking.payment_status == 'pending' ||
            booking?.payment_status == 'pay_later' ||
            booking?.payment_status == 'failed' ? (
              <>
                <TouchableOpacity
                  disabled={disablePaymentBtn}
                  onPress={handlePayNow}>
                  {disablePaymentBtn ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      style={{
                        color: 'white',
                        padding: 5,
                        borderRadius: 5,
                        backgroundColor: 'red',
                      }}
                      numberOfLines={2}>
                      Pay Now
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <Text>-</Text>
            )}
          </View>
        </>
      )}
      <ScrollView style={{width: 150}}>
        {booking?.payment_status != 'cancelled' ? (
          booking?.live_link || booking?.partner_live_link ? (
            <>
              <TouchableOpacity onPress={() => setshowAddLinkModal(true)}>
                <Text style={{textAlign: 'center', color: 'blue'}}>
                  + Update link
                </Text>
              </TouchableOpacity>
              <Text style={{textAlign: 'center'}}>
                {other ? booking?.partner_live_link : booking?.live_link}
              </Text>
            </>
          ) : (
            <TouchableOpacity onPress={() => setshowAddLinkModal(true)}>
              <Text
                style={{textAlign: 'center', color: 'blue'}}
                numberOfLines={2}>
                + Add link
              </Text>
            </TouchableOpacity>
          )
        ) : (
          <>
            <Text style={{textAlign: 'center'}}>-</Text>
          </>
        )}
      </ScrollView>
      {other ? null : (
        <View
          style={{width: 120, justifyContent: 'center', flexDirection: 'row'}}>
          {booking.payment_status == 'pending' ||
          booking?.payment_status == 'pay_later' ||
          booking?.payment_status == 'cancelled' ||
          booking?.payment_status == 'failed' ||
          booking?.payment_type == 'free' ? (
            <>
              <Text style={{textAlign: 'center'}} numberOfLines={2}>
                Not available
              </Text>
            </>
          ) : (
            <TouchableOpacity onPress={getInvoice}>
              <Text
                style={{
                  color: 'white',
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: 'orange',
                  textAlign: 'center',
                }}
                numberOfLines={2}>
                Download Invoice
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <AddLinkModal
        modalVisible={showAddLinkModal}
        setModalVisible={setshowAddLinkModal}
        live_link={other ? booking?.partner_live_link : booking?.live_link}
        other={other}
        booking={booking}
        getBookings={getBookings}
      />
    </View>
  );
}

const AddLinkModal = ({
  modalVisible,
  setModalVisible,
  live_link,
  other,
  booking,
  getBookings,
}) => {
  const [liveLink, setliveLink] = useState('');
  const [inValidUrl, setinValidUrl] = useState(false);
  useEffect(() => {
    if (live_link) setliveLink(live_link);
  }, [live_link]);

  const updateLiveLink = async () => {
    if (!ValidURL(liveLink)) {
      setinValidUrl(true);
      return;
    }
    setinValidUrl(false);
    let data = new FormData();
    data.append('live_link', liveLink);
    data.append('booking_id', booking?.id);
    try {
      // user/update_another_booking_live_link
      let url = other
        ? 'user/update_another_booking_live_link'
        : 'user/update_booking_live_link';

      console.log(url, data);
      let postLink = await axios.post(url, data, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      postLink = await postLink.data;
      console.log(postLink);

      if (postLink.status == 1) {
        getBookings();
        Alert.alert('Link Updated', postLink.message);
        setModalVisible(!modalVisible);
      } else if (postLink.status == 0) {
        Alert.alert('Error', JSON.stringify(postLink?.error));
      } else if (postLink.status == -2) {
        Alert.alert('Error', JSON.stringify(postLink?.validation_array));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Input
              placeholder="Add live link"
              value={liveLink}
              onChangeText={val => setliveLink(val)}
            />
            {inValidUrl ? (
              <Text style={{color: 'red', lineHeight: 20, fontSize: 14}}>
                Please enter a valid url
              </Text>
            ) : null}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  updateLiveLink();
                }}>
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  parentView: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: 'white',
    minHeight: 120,
    marginVertical: 10,
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  inputMainView: {flexDirection: 'row', marginTop: 5},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalView: {
    margin: 20,
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff9330',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonClose: {},
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    // height: 20,
  },
  pickerBorder: {
    borderColor: '#FF9330',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});

export const BookingDetailsHeader = ({history, other}) => {
  return (
    <>
      <View
        style={{
          backgroundColor: '#F5F5F5',
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: 'rgba(0,0,0,0.25)',
          borderBottomWidth: 1.75,
        }}>
        <View style={{width: 100}}>
          <Text style={{textAlign: 'center'}}>Date</Text>
        </View>
        <View style={{width: 100}}>
          <Text style={{textAlign: 'center'}}>Time</Text>
        </View>
        <View style={{width: 120}}>
          <Text style={{textAlign: 'center'}} numberOfLines={2}>
            Page Name
          </Text>
        </View>
        <View style={{width: 100}}>
          <Text style={{textAlign: 'center'}}>Payment Type</Text>
        </View>
        <View style={{width: 100}}>
          <Text style={{textAlign: 'center'}}>Slot Type</Text>
        </View>
        <View style={{width: 120}} numberOfLines={2}>
          <Text style={{textAlign: 'center'}}>Partner</Text>
        </View>
        <View style={{width: 100}}>
          <Text style={{textAlign: 'center'}}>Amount</Text>
        </View>

        <View style={{width: 100}}>
          <Text style={{textAlign: 'center'}}>Payment Status</Text>
        </View>
        {history ? null : (
          <>
            <View style={{width: 100}}>
              <Text style={{textAlign: 'center'}}>Make Payment</Text>
            </View>
          </>
        )}
        <View style={{width: 150}}>
          <Text style={{textAlign: 'center'}}>Live Link</Text>
        </View>
        {other ? null : (
          <View style={{width: 120}}>
            <Text style={{textAlign: 'center'}}>Invoice</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default BookingDetails;
