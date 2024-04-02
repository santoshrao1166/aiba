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
  Linking,
} from 'react-native';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios, {axiosGet, axiosPost} from '../axios';
import {useSelector} from 'react-redux';
import PickerCompo from '../components/useFulCompo/PickerCompo';
import {useDispatch} from 'react-redux';
import MultiSelect from '../components/useFulCompo/MultiSelect';
import {sdRazorpayKeyId} from '../config';
import RazorpayCheckout from 'react-native-razorpay';
import Input from '../components/useFulCompo/Input';

const {width} = Dimensions.get('window');

function BuySdPlan({navigation}) {
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [sdPlans, setsdPlans] = useState([]);
  const [sdGroups, setsdGroups] = useState([]);
  const [sdGroupsToShow, setsdGroupsToShow] = useState([]);
  const [next12Months, setnext12Months] = useState({});

  const [selectedData, setselectedData] = useState({
    plan: null,
    planData: null,
    group: [],
  });

  const [isSubmitting, setisSubmitting] = useState(false);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  //reload screen on each blur   ------------------>
  useEffect(() => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
      'Warning: Failed prop type: Invalid prop `selectedItems` of type `string` supplied to `MultiSelect`, expected `array`.',
    ]);
  }, []);
  //reload screen on each blur    ------------------>
  useEffect(() => {
    let isMounted = true;
    axiosGet(
      'user/sd_plans',
      data => {
        data = data.map(d => {
          return {
            label: d.name,
            value: d.id,
            desc: d.desc,
            price: d.price,
            min: d.min,
            max: d.max,
            sdRequired: d.sd_required,
          };
        });
        console.log(data);
        if (isMounted) setsdPlans(data);
        getNext12MonthNamesWithYear();
      },
      null,
      navigation,
      dispatch,
    );
    axiosGet(
      'user/sd_groups',
      data => {
        if (isMounted) setsdGroups(data);
      },
      null,
      navigation,
      dispatch,
    );
    return () => {
      isMounted = false;
      setsdGroups([]);
      setsdPlans([]);
    };
  }, []);
  function getNext12MonthNamesWithYear() {
    let now = new Date();
    let date = now.getDate();
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
    if (!selectedData?.plan) {
      Alert.alert('', 'Select Plan First then pages.');
      return false;
    }
    if (selectedData?.group.length < selectedData?.planData?.min) {
      Alert.alert(
        '',
        `Please select minimum ${selectedData?.planData?.min} pages`,
      );
      return false;
    }
    return true;
  };

  const cancelBooking = async bookingId => {
    try {
      let deleteit = await axios.get(
        'user/cancel_sd_booking?booking_id=' + bookingId,
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
    data.append('plan', selectedData?.plan);
    selectedData?.group.map(g => {
      data.append('groups[]', g);
    });
    console.log(data);
    // return;
    axiosPost(
      'user/sd_booking_process',
      data,
      orderCreation => {
        console?.log(orderCreation);
        let options = {
          description: 'Payment for buying plan',
          image: 'https://www.aibaonline.in/images/logo_new.png',
          currency: 'INR',
          key: orderCreation?.razorpay_key,
          amount: parseInt(orderCreation?.amount) * 100,
          name: 'Shoppers Darbar',
          order_id: orderCreation?.razorpayOrderId,
          theme: {color: '#53a20e'},
        };
        // console.log(options);
        RazorpayCheckout.open(options)
          .then(async response => {
            // handle success
            // console.log(response);
            setisSubmitting(false);
            Alert.alert(
              'Payment success',
              orderCreation?.app_message?.replace(/\\n/g,"\n"),
            );
            // '*CODE FOR FEB POSTS *- \n#SDfebSale \nThanks for the payment.\nPls mention code and post#no on TOP with starting price range in the description of your post.\n*2 posts daily in SD (if opted) & 3 in the sister group as opted BEFORE 10pm.\nNo page link, fb /whatsapp group link is allowed in the description of posts.\nNo sharing through page.\nPage approvals may take time upto an hour, pls do not ping admins for the same.\nPosts after 10pm will be deleted and wont be considered for the next day.\nHappy trading!',
            navigation.navigate('Sd Bookings');
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

  const getSelectedPlanData = planId => {
    let planData;
    sdPlans.forEach(plan => {
      if (planId == plan.value) {
        planData = plan;
      }
    });

    return planData;
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
                Shoppers' Darbar Booking
              </Text>
            </View>
          </View>

          {/* btn to go my sd booking page  */}
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Sd Bookings')}
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
                My SD Bookings
              </Text>
            </TouchableOpacity>
          </View>
          {isSubmitting == true ? (
            <Loader />
          ) : (
            <>
              <View style={styles.SdMain}>
                <Input
                  label="Month"
                  required
                  value={next12Months?.label}
                  editable={false}
                />
                <PickerCompo
                  showLabel="CHOOSE PLAN"
                  required
                  data={sdPlans}
                  selectedValue={selectedData?.plan}
                  onValueChange={val => {
                    let planData = getSelectedPlanData(val);
                    console.log(planData);
                    // if sd is not requied means plan D remove sd group
                    if (planData?.sdRequired == 0) {
                      let toShow = [];
                      //remove sd group for plan D
                      sdGroups.forEach(g => {
                        if (g.id != '1') {
                          toShow = [...toShow, g];
                        }
                      });
                      setsdGroupsToShow(toShow);
                    } else {
                      setsdGroupsToShow(sdGroups);
                    }

                    setselectedData(pre => {
                      let toReturn = {
                        group: !val || planData?.sdRequired == 0 ? [] : ['1'],
                        plan: val,
                        planData: planData,
                      };
                      return toReturn;
                    });
                  }}
                  Placeholder="Select plan"
                  noDataMassage="No plan is active"
                  mode="dropdown"
                />
                {selectedData?.planData ? (
                  <Text style={styles.planDesc}>
                    {selectedData?.planData?.desc}
                  </Text>
                ) : null}

                <View style={styles.inputMainView}>
                  <Text style={styles.label}>Select Pages</Text>
                </View>
                <MultiSelect
                  items={sdGroupsToShow}
                  onSelectedItemsChange={selectedItems => {
                    if (!selectedData?.plan) return;
                    // plan need sd then
                    if (
                      selectedData?.planData?.sdRequired == 1 &&
                      !selectedItems.includes('1')
                    )
                      return;
                    //want to select more then max
                    if (selectedItems?.length > selectedData?.planData?.max)
                      return;
                    //set selected pages
                    setselectedData(pre => {
                      return {
                        ...pre,
                        group: selectedItems,
                      };
                    });
                  }}
                  selectedItems={selectedData?.group}
                  selectText="Select Groups"
                  searchInputPlaceholderText="Select Groups"
                />

                <View style={styles.inputMainView}>
                  <Text style={[styles.label, {fontWeight: '700'}]}>
                    Terms & Conditions
                  </Text>
                </View>
                <TermsAndCondition />
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
                    Pay : Rs.
                    {sdPlans[parseInt(selectedData?.plan) - 1]?.price
                      ? selectedData?.planData?.price
                      : 0}
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

const TermsAndCondition = () => {
  return (
    <Text>
      Terms & Conditions: 1. AMOUNT PAID IS FOR MONTHLY RENEWALS.
      {'\n'}
      2. MEMBERSHIP WILL END ON SECOND LAST DAY OF THE MONTH, IRRESPECTIVE OF
      THE DATE YOU PAID ON.{'\n'}
      3. MEMBERSHIP AMOUNT IS NON REFUNDABLE.{'\n'}
      4. POSTING TIME IS 8AM -10PM.{'\n'}
      5. METHOD OF COMMUNICATION IS WHATSAPP TEXT TO ANY 1 ADMIN.
      {'\n'}
      6. SHOPPERS DARBAR IS A PLATFORM, NOT RESPONSIBLE FOR ANY DEALINGS BETWEEN
      SELLER AND THE CUSTOMER.{'\n'}
      7. NO REPLICA OR COVID RELATED PRODUCTS ARE ALLOWED TO POST.
      {'\n'}
      9. PACK DOES NOT INCLUDE ANY LIVE SESSIONS.{'\n'}
      10. ADDING FB PAGE LINK/WHATSAPP GROUP LINK IS NOT ALLOWED IN THE POST
      DESCRIPTION.{'\n'}
      {'\n'}
      You agree to share information entered on this page with SHOPPERS DARBAR
      (owner of this page) and Razorpay, adhering to applicable laws. Facebook
      Group Links A. Main group - SHOPPERS’ DARBAR{'\n'}
      {'\n'}
      <View style={{flexDirection: 'column'}}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://www.facebook.com/groups/shoppers.darbar/');
          }}>
          <Text style={{color: 'blue'}}>1. Shoppers’ Darbar </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              'https://www.facebook.com/groups/diwaligiftsideas/',
            );
          }}>
          <Text style={{color: 'blue'}}>
            2. Festival gift ideas : celebrations shoppe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              'https://www.facebook.com/groups/shoppingmantra.shoppersdarbarpremium',
            );
          }}>
          <Text style={{color: 'blue'}}>3. Shopping Mantra </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://www.facebook.com/groups/891948784168350/');
          }}>
          <Text style={{color: 'blue'}}>4. Shopping Brigade </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              'https://www.facebook.com/groups/Handicraftsforsale/',
            );
          }}>
          <Text style={{color: 'blue'}}>5. SD : Handlooms & Handicrafts</Text>
        </TouchableOpacity>
      </View>
    </Text>
  );
};

const styles = StyleSheet.create({
  planDesc: {
    marginVertical: 5,
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
  },
  SdMain: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 40,
    marginTop: 30,
  },
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

export default BuySdPlan;
