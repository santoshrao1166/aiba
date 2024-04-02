import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  LogBox,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios, {axiosGet, axiosPost} from '../axios';
import {useSelector} from 'react-redux';
import PickerCompo from '../components/useFulCompo/PickerCompo';
import {useDispatch} from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
// import {advertGroupSlot} from '../assets/data/TimeSlot.json';
import Input from '../components/useFulCompo/Input';

const {width} = Dimensions.get('window');

function AdvertHourBooking({navigation}) {
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [next12Months, setnext12Months] = useState({});
  const [advertGroups, setadvertGroups] = useState([]);
  const [advertSlots, setadvertSlots] = useState([]);
  const [selectedData, setselectedData] = useState({
    group: null,
    month: '',
    year: null,
    timeSlot: null,
  });

  const [isSubmitting, setisSubmitting] = useState(false);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  //reload screen on each blur    ------------------>
  useEffect(() => {
    let isMounted = true;
    axiosGet(
      'user/adv_groups',
      data => {
        data = data.map(d => {
          return {
            label: d.name,
            value: d.id,
            price: d.solo_price,
          };
        });
        if (isMounted) setadvertGroups(data);
      },
      null,
      navigation,
      dispatch,
    );

    getNext12MonthNamesWithYear();
    return () => {
      isMounted = false;
      setadvertGroups([]);
    };
  }, []);

  async function getAdvSlots(adv_page_id) {
    axiosGet(
      'user/adv_hours?page_id=' + adv_page_id,
      data => {
        if (data.length == 0) {
          Alert.alert('Heya!', 'No slots are available in this page.');
          setadvertSlots([]);
          return;
        }
        data = data.map(d => {
          return {
            label: d.time,
            value: d.time,
            price: d.price,
            disable: d.booked,
            for: d.text,
          };
        });
        console.log(data);
        setadvertSlots(data);
      },
      null,
      navigation,
      dispatch,
    );
  }

  function getNext12MonthNamesWithYear() {
    let now = new Date();
    let month = now.getMonth();
    let year = now.getFullYear();

    let names = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let res = [];
    axiosGet('user/adv_booking_month', data => {
      setnext12Months({
        label: names[parseInt(data.month) - 1],
        value: names[parseInt(data.month) - 1],
      });
    });

    return res;
  }

  const formValidation = () => {
    if (!selectedData?.group) {
      Alert.alert('', 'Select a page first then proceed.');
      return false;
    }
   
    if (selectedData?.timeSlot == null) {
      Alert.alert('', `Select slot.`);
      return false;
    }
    return true;
  };

  const cancelBooking = async bookingId => {
    try {
      let deleteit = await axios.get(
        'user/cancel_adv_booking?booking_id=' + bookingId,
      );
      deleteit = await deleteit.data;
      console.log('deleted');
    } catch (error) {
      console.log(error, '+++++>in delete it part');
    }
  };
  const handleSubmit = async () => {
    if (!formValidation()) return;

    setisSubmitting(true);
    let data = new FormData();
    data.append('month', next12Months?.month);
    data.append('year', selectedData?.year);
    data.append('group', selectedData?.group);
    data.append('time', selectedData?.timeSlot);

    axiosPost(
      'user/adv_booking_process',
      data,
      orderCreation => {
        // console?.log(orderCreation?.amount);
        let options = {
          description: 'Payment for advert page booking.',
          image: 'https://www.aibaonline.in/images/logo_new.png',
          currency: 'INR',
          key: orderCreation?.razorpay_key,
          amount: parseInt(orderCreation?.amount) * 100,
          name: 'AIBA',
          order_id: orderCreation?.razorpayOrderId,
          theme: {color: '#53a20e'},
        };
        // console.log(options);
        RazorpayCheckout.open(options)
          .then(async response => {
            // handle success
            // console.log(response);
            setisSubmitting(false);
            Alert.alert('Payment success', 'Your payment is done.');
            navigation.navigate('Adv Bookings');
          })
          .catch(error => {
            // handle failure
            setisSubmitting(false);
            cancelBooking(orderCreation?.booking_id);
            console.log('error in craeting order  ->', error);
            error = JSON.parse(error.description).error.description;
            Alert.alert('Error', ` ${error}`);
          });
      },
      res => {
        Alert.alert('Error', res.error);
        setisSubmitting(false);
      },
      null,
      navigation,
      dispatch,
    );
  };
  return (
    <>
      <ScrollView
        backgroundColor="#f2f2f2"
        showsVerticalScrollIndicator={false}>
        <Header navigation={navigation} isAuth />

        <View style={{marginHorizontal: width * 0.05, flex: 1}}>
          {/* top arrow and text  */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
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
              <Text
                style={{
                  fontSize: 20,
                  lineHeight: 27,
                  fontWeight: '700',
                  paddingBottom: 7,
                }}>
                Advert Page Booking
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Adv Bookings')}
              style={{
                padding: 10,
                marginTop: 20,
                backgroundColor: 'orange',
                borderRadius: 10,
                width: 150,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <Text style={{color: 'white', textAlign: 'center'}}>
                My Advert Bookings{' '}
              </Text>
            </TouchableOpacity>
          </View>

          {isSubmitting == true ? (
            <Loader />
          ) : (
            <>
              <View style={styles.buyPlanMain}>
                <Input
                  label="Month"
                  required
                  value={next12Months?.label}
                  editable={false}
                />
                <PickerCompo
                  showLabel="Page"
                  required
                  data={advertGroups}
                  selectedValue={selectedData?.group}
                  onValueChange={val => {
                    console.log(val);
                    getAdvSlots(val);
                    setselectedData(pre => {
                      return {...pre, group: val, timeSlot: null};
                    });
                  }}
                  Placeholder="Select Page"
                  noDataMassage="No page is active"
                  mode="dropdown"
                />

                <PickerCompo
                  showLabel="Time Slot"
                  required
                  data={advertSlots}
                  selectedValue={selectedData?.timeSlot}
                  onValueChange={val => {
                    let chosenAdvSlot;
                    // console.log(advertSlots);
                    advertSlots.forEach(s => {
                      if (s.value == val) chosenAdvSlot = s;
                    });
                    // console.log(chosenAdvSlot);
                    if (chosenAdvSlot?.disable) {
                      setselectedData(pre => {
                        return {
                          ...pre,
                          timeSlot: null,
                          price: 0,
                        };
                      });
                      console.log('not eligible');
                      return;
                    }
                    setselectedData(pre => {
                      return {
                        ...pre,
                        timeSlot: chosenAdvSlot?.value,
                        for: chosenAdvSlot?.for,
                        price: chosenAdvSlot?.price,
                      };
                    });
                  }}
                  Placeholder="Select time slot"
                  noDataMassage="No slot is active"
                  itemNotAvailableText="Booked"
                  mode="dropdown"
                />
                {selectedData?.timeSlot ? (
                  <Input
                    label="For"
                    required
                    value={selectedData?.for}
                    editable={false}
                  />
                ) : null}
              </View>
              <View style={styles.bottomView}>
                <View style={styles.razorpayimageView}>
                  <Image
                    source={{
                      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDyKuyElKVeBZ0oS7FhrYpb-ReQGfkFGtMNxz-7typwv9cz6OW-qn-7cJfuqi1T-UT0g&usqp=CAU',
                    }}
                    style={styles.razorpayimage}
                    resizeMode="contain"
                  />
                </View>

                <TouchableOpacity
                  style={styles.paymentBtn}
                  onPress={handleSubmit}>
                  <Text style={styles.paymentBtnText}>
                    Pay : Rs. {selectedData?.price}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const Loader = () => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size={40} color="black" />
    </View>
  );
};

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
  checkBox: {
    color: 'white',
    tintColor: '#FF9330',
    marginRight: Platform.OS == 'ios' ? 15 : null,
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  buyPlanMain: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 40,
    marginTop: 30,
  },
  heightBox: {
    height: 15,
  },
  bottomView: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  razorpayimageView: {
    width: '60%',
    height: 40,
  },
  razorpayimage: {
    height: 40,
    width: '100%',
  },
  paymentBtn: {
    height: 40,
    width: '40%',
    backgroundColor: '#4F91FF',
  },
  paymentBtnText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 38,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default AdvertHourBooking;

// //get all booked slots of this page
// axiosGet(
//   'user/adv_bookings?group_id=' + val,
//   data => {
//     data = data.map(d => d.time);
//     //add disable flag in advert slots
//     setadvertSlots(pre => {
//       let newSlots = pre.map(p => {
//         return {...p, disable: data.includes(p.value)};
//       });
//       return newSlots;
//     });
//     // console.log(data);
//     setbookedadvertSlots(data);
//   },
//   res => console.log(res),
//   navigation,
//   dispatch,
// );

// ///get this group price
// if (!val) {
//   setgroupPrice(0);
//   return;
// }
// advertGroups.map(g => {
//   if (g.value == val) {
//     setgroupPrice(g.price);
//   }
// });

