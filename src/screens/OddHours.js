import React, { useEffect, useState } from "react";
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import Header from "../components/Header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import SlotDate from "../components/SlotDate";
import TimeSlotBar from "../components/TimeSlotBar";
import axios, { axiosGet, axiosPost ,axiosCustomGet} from "../axios";
import { serverEndPoint } from "../config";
import { Picker } from "@react-native-picker/picker";
import RazorpayCheckout from "react-native-razorpay";
import RenderHtml from 'react-native-render-html';

import {
  evenGroupTimeSlot,
  oddGroupTimeSlot,
  sdGroupTimeSlot,
} from "../assets/data/TimeSlot.json";
import { weekDays, months } from "../importantFeatures";
import { useDispatch, useSelector } from "react-redux";
const { height, width } = Dimensions.get("window");
import Table from "../components/Table";
////////////////////////////////////////////////////////////////
// group is same as page all vaiable contain group is for page
////////////////////////////////////////////////////////////////
function OddHours({ navigation }) {
  const colorScheme = useSelector((state) => state.theme);
  const [allGroups, setallGroups] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [selectedPlan, setselectedPlan] = useState("paid");
  const [selectedGroup, setselectedGroup] = useState(null);
  const [selectedPrice, setselectedPrice] = useState(null);
  const [selectedGroupType, setselectedGroupType] = useState(null);
  const [cartData, setcartData] = useState([]);
  const [bookingTimer, setBookingTimer] = useState("");
  const [timeSlots, settimeSlots] = useState(oddGroupTimeSlot);
  const [bookedSlots, setbookedSlots] = useState([]);
  const [reservedSlots, setreservedSlots] = useState([]);
  const [paymentInProcessSlots, setpaymentInProcessSlots] = useState([]);
  const [errorInBookingSlots, seterrorInBookingSlots] = useState(null);
  const [selectedDate, setselectedDate] = useState({
    day: null,
    date: null,
    month: null,
    year: null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [settingNotes, setSettingNotes] = useState("");
  const [nextSevenDays, setnextSevenDays] = useState([]);
  const [enabledDropDown, setEnabledDropDown] = useState(true);

  
  const dispatch = useDispatch();

  function getNextDates(startDate, daysToAdd) {
    var aryDates = [];
    for (var i = 0; i < daysToAdd; i++) {
      var currentDate = new Date();
      currentDate.setDate(startDate.getDate() + i);
      currentDate.setMonth(startDate.getMonth());
      currentDate.setFullYear(startDate.getFullYear());
      // currentDate.setDate(startDate.getDate() + i);
      if (currentDate.getDate() == 1 && i) {
        break;
      }
      let ithDay = {
        day: currentDate.getDay(),
        date: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      };
      if (i == 0) setselectedDate(ithDay);
      aryDates.push(ithDay);
    }
    return aryDates;
  }
  function getNextDates2(startDate) {
    var aryDates = [];
    var lastDayOfMonth = new Date(new Date(startDate.getFullYear(), startDate.getMonth()+1, 0).setDate(new Date(startDate.getFullYear(), startDate.getMonth()+1, 0).getDate() + 1));
    aryDates.push({
      day: startDate.getDay(),
      date: startDate.getDate(),
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear(),
    })
    setselectedDate({
      day: startDate.getDay(),
      date: startDate.getDate(),
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear(),
    })
    while(startDate < lastDayOfMonth){
   var newDate = new Date(startDate.setDate(startDate.getDate() + 1));
   let ithDay = {
    day: newDate.getDay(),
    date: newDate.getDate(),
    month: newDate.getMonth() + 1,
    year: newDate.getFullYear(),
  };
  if (newDate.getDate() == lastDayOfMonth.getDate()) 
  break;
  aryDates.push(ithDay);
  startDate = newDate;
  }
  return aryDates
}

  function getFreePlanNextDates(startDate, daysToAdd) {
    var aryDates = [];
    for (var i = 0; i < daysToAdd; i++) {
      var currentDate = new Date();
      currentDate.setDate(1 + i);
      currentDate.setMonth(startDate.getMonth() + 1);
      let toSumInYear = startDate.getMonth() + 1 == 12 ? 1 : 0;
      // console.log(toSumInYear);
      currentDate.setFullYear(startDate.getFullYear() + toSumInYear);
      // currentDate.setDate(startDate.getDate() + i);
      if (currentDate.getDate() == 1 && i) {
        break;
      }
      let ithDay = {
        day: currentDate.getDay(),
        date: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      };
      if (i == 0) setselectedDate(ithDay);
      // console.log(ithDay);
      aryDates.push(ithDay);
    }
    return aryDates;
  }
  const fetchMonth = async () => {
    axiosGet(
      "user/odd_multi_booking_month",
      (data) => {
        setCurrentMonth(parseInt(data.month));
        getDateRange("paid");
      },
      (error) => {
        console.log(error, "current month error");
      },
      navigation,
      dispatch
    );
  };

  function getDateRange() {
    let today = new Date();
    let year = today.getMonth() == 11?today.getFullYear()+1:today.getFullYear();
    let currentStartDate = new Date(today.setMonth(currentMonth-1,1));
    let startingDate;
    currentStartDate.setFullYear(year);
    console.log(currentStartDate,"year",year);
    currentStartDate.getMonth() != new Date().getMonth() ? startingDate =  currentStartDate: 
    startingDate = new Date();
    setnextSevenDays(getNextDates2(startingDate, 30));
  }

  function getTodayDate(plan) {
    let today = new Date();
    // console.log(plan, '98');
    if (plan == "free") {
      setnextSevenDays(getFreePlanNextDates(today, 31));
    } else setnextSevenDays(getNextDates(today, 30));
  }
  const fetchGroupData = async () => {
    axiosGet(
      "/user/user_odd_groups?type=odd",
      (data) => {
        setallGroups(data);
      },
      (error) => {},
      navigation,
      dispatch
    );
  };
  const getSettingNotes = async () => {
    axiosGet(
      "/user/multi_settings_data",
      (data) => {
        setSettingNotes(data.field_2);
      },
      (error) => {},
      navigation,
      dispatch
    );
  };
  // get group and date and time slot
  useEffect(() => {
    fetchMonth();
    getSettingNotes();
    fetchGroupData();
  }, [currentMonth]);

  //get booked Slots
  const getBookedSlots = async () => {
    // console.log(selectedDate,"selectedDate")
    if (selectedDate.date && selectedGroup) {
      setisLoading(true);
      axiosCustomGet(
        `/user/multi_bookings_by_day_test?year=${selectedDate?.year}&month=${selectedDate?.month}&date=${selectedDate?.date}&group_id=${selectedGroup}&type=${selectedPlan}`,
        (data) => {
          seterrorInBookingSlots(null);
          setisLoading(false);
          setbookedSlots(data.data);
          setreservedSlots(data.ReservedSlot);
          setpaymentInProcessSlots(data.PaymentInProcessSlot);
        },
        (error) => {
          setisLoading(false);
          seterrorInBookingSlots(error);
        },
        navigation,
        dispatch
      );
    }
  };
  const total = () => {
    let val = cartData.map((item) => {
      return parseInt(item.amount);
    });
    return val.reduce((a, b) => a + b, 0);
  };
  const cancelMultiBooking = async bookingId => {
    try {
      let deleteit = await axios.get(
        'user/cancel_multi_booking?booking_id=' + bookingId,
      );
      deleteit = await deleteit.data;
      console.log('deleted');
    } catch (error) {
      console.log(error, '+++++>in delete it part');
    }
  };
  const clearUserCart = async () => {
    try {
      let deleteit = await axios.get(
        serverEndPoint + "user/delete_cart_by_user"
      );
      deleteit = await deleteit.data;
      console.log("deleted user cart");
    } catch (error) {
      console.log(error, "+++++>in delete it part");
    }
    setEnabledDropDown(true);
  };
  const onBuyNow = async () => {
    let data = new FormData();
    data.append("page_id", selectedGroup);
    data.append("selected_group_type", selectedGroupType);
    axiosPost(
      'user/multi_bookings',
      data,
      orderCreation => {
        console?.log(orderCreation);
        let options = {
          description: 'Payment for buying plan',
          image: 'https://www.aibaonline.in/images/logo_new.png',
          currency: 'INR',
          key: orderCreation?.razorpay_key,
          amount: total(),
          name: 'Aiba',
          order_id: orderCreation?.razorpayOrderId,
          theme: {color: '#53a20e'},
        };
        // console.log(options);
        RazorpayCheckout.open(options)
          .then(async response => {
            clearUserCart();
            Alert.alert(
              'Payment success',
              orderCreation?.message?.replace(/<br>/g,"\n"),
            );
            // '*CODE FOR FEB POSTS *- \n#SDfebSale \nThanks for the payment.\nPls mention code and post#no on TOP with starting price range in the description of your post.\n*2 posts daily in SD (if opted) & 3 in the sister group as opted BEFORE 10pm.\nNo page link, fb /whatsapp group link is allowed in the description of posts.\nNo sharing through page.\nPage approvals may take time upto an hour, pls do not ping admins for the same.\nPosts after 10pm will be deleted and wont be considered for the next day.\nHappy trading!',
            navigation.navigate('Multi Odd Hours Bookings');
          })
          .catch(async(error) => {
            clearUserCart();
            console.log('error in craeting order  ->', error);
            // error = JSON.parse(error.description).error.description;
            // Alert.alert('Payment Cancelled' , ` ${error.description}`);
            cancelMultiBooking(orderCreation?.booking_id).then(()=>{
              getBookedSlots()
            });
          });
      },
      res => {
        alert(res.error);
      },
      null,
      navigation,
      dispatch,
    );
  };

  const onTimeOut = async () => {
    alert("Time is over. Request you to pls restart the process again.");
    clearUserCart();
  };
  const onAddDetails = (cartData, amount) => {
    setcartData(cartData.data);
    setBookingTimer(cartData.time);
  };
  const onAddSlots = (cartData, amount) => {
      getBookedSlots()
      setEnabledDropDown(false);
  };
  
  // get booked slots
  useEffect(() => {
    seterrorInBookingSlots(null);
    getBookedSlots();
  }, [selectedDate?.date, selectedGroup, selectedDate?.month, selectedPlan]);

  useEffect(() => {
    cartData?.length==0?setEnabledDropDown(true):null
  }, [cartData]);
  
  //reload on each focus
  useEffect(() => {
    let reload = navigation.addListener("focus", () => {
      fetchGroupData();
      setselectedGroup(null);
      getBookedSlots();
      setEnabledDropDown(true)
      // setselectedPlan('paid');
      // getTodayDate('paid');
    });
    return reload;
  }, [navigation]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: "#F2F2F2",
      }}
    >
      <Header isAuth navigation={navigation} />

      <View style={{ marginHorizontal: width * 0.05, flex: 1 }}>
        {/* back btn and book a slot  */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back-ios" size={25} />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              marginRight: 25,
            }}
          >
            <View
              style={{
                borderBottomColor: "#FF9330",
                borderBottomWidth: 3,
                borderbottomStyle: "solid",
                marginLeft: 20,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{ fontSize: 25, fontWeight: "700", paddingBottom: 7 }}
              >
                Book Slots
              </Text>
            </View>
          </View>
        </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Multi Odd Hours Bookings')}
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
                My Multi Bookings
              </Text>
            </TouchableOpacity>
        {allGroups.length == 0 ? (
          <>
            <Text
              style={{
                color: "red",
                fontSize: 20,
                fontWeight: "600",
                textAlign: "center",
                marginTop: 150,
              }}
            >
              Welcome to SD-AIBA Platform.{"\n"}
              Hey!{"\n"}
              Now, you are eligible to register on Shoppers’ Darbar for posting.
              For live sessions on AIBA pages, you need to wait for admin
              approval.
            </Text>
          </>
        ) : (
          <>
            {/* select plan free or paid  */}
            <View
              style={{
                marginTop: 20,
                borderColor: "#FF9330",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 10,
              }}
            >
              <Picker
                style={{ color: "rgba(0,0,0,0.8)" }}
                selectedValue={selectedPlan}
                onValueChange={(val) => {
                  setselectedPlan(val);
                  let date = new Date();

                  if (val == "free") {
                    setnextSevenDays(getFreePlanNextDates(date, 31));
                  } else {
                    setnextSevenDays(getNextDates(date, 31));
                  }
                }}
              >
                <Picker.Item
                  color={
                    colorScheme == "dark"
                      ? Platform.OS == "ios"
                        ? "black"
                        : "white"
                      : "black"
                  }
                  label="Paid"
                  value="paid"
                />
              </Picker>
            </View>
            {/* select page  */}
            <View
              style={{
                marginTop: 20,
                borderColor: "#FF9330",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 10,
              }}
            >
              <Picker
                style={{ color: "rgba(0,0,0,0.8)" }}
                selectedValue={selectedGroup}
                enabled={enabledDropDown}
                onValueChange={(val) => {
                  setselectedGroup(val);
                  allGroups.forEach((group) => {
                    if (group?.id == val) {
                      setselectedGroup(val);
                      setselectedPrice(group.solo_price);
                      setselectedGroupType(group.group_type);
                      settimeSlots(
                        group?.group_type == "even"
                          ? evenGroupTimeSlot
                          : group?.group_type == "sd"
                          ? sdGroupTimeSlot
                          : oddGroupTimeSlot
                      );
                    }
                  });
                }}
              >
                <Picker.Item
                  color={
                    colorScheme == "dark"
                      ? Platform.OS == "ios"
                        ? "black"
                        : "white"
                      : "black"
                  }
                  label="Select Group"
                  value={null}
                />
                {allGroups.length ? (
                  allGroups?.map((group, i) => (
                    <Picker.Item
                      key={i}
                      color={
                        colorScheme == "dark"
                          ? Platform.OS == "ios"
                            ? "black"
                            : "white"
                          : "black"
                      }
                      label={`${group?.name} ( ${
                        group?.group_type == "even"
                          ? "Normal Hours"
                          : group?.group_type == "sd"
                          ? "Shoppers Darbar"
                          : "Odd Hours"
                      }  )`}
                      value={group?.id}
                    />
                  ))
                ) : (
                  <Picker.Item
                    label={"You have not assigned to any page"}
                    color={
                      colorScheme == "dark"
                        ? Platform.OS == "ios"
                          ? "black"
                          : "white"
                        : "black"
                    }
                    value={null}
                  />
                )}
              </Picker>
            </View>
            {/* select date  */}

            {/* all dates  */}
            <View style={{ marginTop: 20 }}>
              <Text>{`${months[selectedDate?.month]} ${
                selectedDate?.year
              }`}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {nextSevenDays?.map((day, i) => (
                <SlotDate
                  key={i}
                  selected={selectedDate?.date == day?.date ? true : false}
                  wholeDateObj={day}
                  day={weekDays[day?.day]}
                  date={day?.date}
                  setSeletedDate={setselectedDate}
                />
              ))}
            </ScrollView>
            {/* pick a time slot  */}
            <Text
              style={{ fontWeight: "600", marginTop: 15, marginBottom: 10 }}
            >
              Pick a time slot
            </Text>
            <TimeSlotBar header leftContent="Time" rightContent="Slot" />
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="#ffb800"
                style={{ marginTop: 20 }}
              />
            ) : selectedGroup && selectedDate ? (
              errorInBookingSlots ? (
                <>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      fontSize: 16,
                      fontWeight: "600",
                      color: "red",
                    }}
                  >
                    {errorInBookingSlots}
                  </Text>
                </>
              ) : (
                timeSlots?.map((slot, i) => (
                  <TimeSlotBar
                    key={i}
                    date={selectedDate}
                    plan={selectedPlan}
                    press={() => console.log("Pressed The Button")}
                    groupId={selectedGroup}
                    slot={slot}
                    leftContent={slot.time}
                    rightContent={
                      bookedSlots.findIndex((x) => x.hour == slot.startTime) !=
                      -1
                        ? "Not Available"
                        : (reservedSlots.findIndex((x) => x.hour == slot.startTime) !=
                        -1
                          ? "Reserved"
                          : ((paymentInProcessSlots.findIndex((x) => x.hour == slot.startTime) !=
                          -1
                            ? "Reserved"
                            : "Available")))
                        
                    }
                    navigation={navigation}
                    multi
                    soloPrice={selectedPrice}
                    onAddSlots={(cartData) => onAddSlots(cartData)}
                    onAddDetails={(cartData) => onAddDetails(cartData)}
                  />
                ))
              )
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Pick a group first
              </Text>
            )}
            {/* for margin in bottom  */}
            <View style={{ height: 50 }}></View>
          </>
        )}
      </View>

      {cartData.length > 0 && selectedGroup && (
        <View>
          <Table headers={["Date", "Time", "Price", ""]} data={cartData} />
          <Text
            style={{
              textAlign: "left",
              paddingHorizontal: width * 0.1,
              color: "red",
              fontWeight: "bold",
              marginTop: 0,
              marginBottom: 10,
            }}
          >
            Time Left ={" "}
            {bookingTimer.split(":")[0] > -1 ? bookingTimer : "0 : 0"}
          </Text>
          <View style={{ padding: height * 0.05 }}>
            <TouchableOpacity
              onPress={() => {
                bookingTimer.split(":")[0] > -1 ? onBuyNow() : onTimeOut();
              }}
              style={{
                backgroundColor: "#FFB800",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 10,
                width: width * 0.3,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={{padding:20}}>
      <RenderHtml
      contentWidth={320}
      source={{ html: settingNotes }}
      />
      </View>
    </ScrollView>
  );
}

export default OddHours;
