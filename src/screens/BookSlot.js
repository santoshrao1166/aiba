import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import SlotDate from '../components/SlotDate';
import TimeSlotBar from '../components/TimeSlotBar';
import axios, {axiosGet} from '../axios';
import {Picker} from '@react-native-picker/picker';
import {
  evenGroupTimeSlot,
  oddGroupTimeSlot,
  sdGroupTimeSlot,
} from '../assets/data/TimeSlot.json';
import {weekDays, months} from '../importantFeatures';
import {useDispatch, useSelector} from 'react-redux';
const {height, width} = Dimensions.get('window');
////////////////////////////////////////////////////////////////
// group is same as page all vaiable contain group is for page
////////////////////////////////////////////////////////////////
function BookSlot({navigation}) {
  const colorScheme = useSelector(state => state.theme);
  const [allGroups, setallGroups] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [selectedPlan, setselectedPlan] = useState('paid');
  const [selectedGroup, setselectedGroup] = useState(null);
  const [timeSlots, settimeSlots] = useState([]);
  const [bookedSlots, setbookedSlots] = useState([]);
  const [errorInBookingSlots, seterrorInBookingSlots] = useState(null);
  const [selectedDate, setselectedDate] = useState({
    day: null,
    date: null,
    month: null,
    year: null,
  });

  const [nextSevenDays, setnextSevenDays] = useState([]);
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
  function getTodayDate(plan) {
    let today = new Date();
    // console.log(plan, '98');
    if (plan == 'free') {
      setnextSevenDays(getFreePlanNextDates(today, 31));
    } else setnextSevenDays(getNextDates(today, 30));
  }
  const fetchGroupData = async () => {
    axiosGet(
      '/user/user_groups',
      data => {
        console.log(data,"data")
        setallGroups(data);
      },
      error => {},
      navigation,
      dispatch,
    );
  };
  // get group and date and time slot
  useEffect(() => {
    getTodayDate('paid');
    const interval = setInterval(() => {
      console.log('This will run every second!');
      fetchGroupData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  //get booked Slots
  const getBookedSlots = async () => {
    if (selectedDate.date && selectedGroup) {
      setisLoading(true);
      axiosGet(
        `/user/bookings_by_day?year=${selectedDate?.year}&month=${selectedDate?.month}&date=${selectedDate?.date}&group_id=${selectedGroup}&type=${selectedPlan}`,
        data => {
          // console.log(data, timeSlots);

          seterrorInBookingSlots(null);
          setisLoading(false);
          setbookedSlots(data);
        },
        error => {
          setisLoading(false);
          seterrorInBookingSlots(error);
        },
        navigation,
        dispatch,
      );
    }
  };

  // get booked slots
  useEffect(() => {
    seterrorInBookingSlots(null);
    getBookedSlots();
  }, [selectedDate?.date, selectedGroup, selectedDate?.month, selectedPlan]);

  //reload on each focus
  useEffect(() => {
    let reload = navigation.addListener('focus', () => {
      fetchGroupData();
      setselectedGroup(null);
      getBookedSlots();
      // setselectedPlan('paid');
      // getTodayDate('paid');
    });
    return reload;
  }, [navigation]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: '#F2F2F2',
      }}>
      <Header isAuth navigation={navigation} />

      <View style={{marginHorizontal: width * 0.05, flex: 1}}>
        {/* back btn and book a slot  */}
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
            <View
              style={{
                borderBottomColor: '#FF9330',
                borderBottomWidth: 3,
                borderbottomStyle: 'solid',
                marginLeft: 20,
                paddingHorizontal: 20,
              }}>
              <Text style={{fontSize: 25, fontWeight: '700', paddingBottom: 7}}>
                Book AIBA 1 to 4
              </Text>
            </View>
          </View>
        </View>

        {allGroups.length == 0 ? (
          <>
            <Text
              style={{
                color: 'red',
                fontSize: 20,
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 150,
              }}>
              Welcome to SD-AIBA Platform.{'\n'}
              Hey!{'\n'}
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
                borderColor: '#FF9330',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 10,
              }}>
              <Picker
                style={{color: 'rgba(0,0,0,0.8)'}}
                selectedValue={selectedPlan}
                onValueChange={val => {
                  setselectedPlan(val);
                  let date = new Date();

                  if (val == 'free') {
                    setnextSevenDays(getFreePlanNextDates(date, 31));
                  } else {
                    setnextSevenDays(getNextDates(date, 31));
                  }
                }}>
                <Picker.Item
                  color={
                    colorScheme == 'dark'
                      ? Platform.OS == 'ios'
                        ? 'black'
                        : 'white'
                      : 'black'
                  }
                  label="Paid"
                  value="paid"
                />
                <Picker.Item
                  color={
                    colorScheme == 'dark'
                      ? Platform.OS == 'ios'
                        ? 'black'
                        : 'white'
                      : 'black'
                  }
                  label="Free"
                  value="free"
                />
              </Picker>
            </View>
            {/* select page  */}
            <View
              style={{
                marginTop: 20,
                borderColor: '#FF9330',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 10,
              }}>
              <Picker
                style={{color: 'rgba(0,0,0,0.8)'}}
                selectedValue={selectedGroup}
                onValueChange={val => {
                  setselectedGroup(val);
                  allGroups.forEach(group => {
                    if (group?.id == val) {
                      settimeSlots(
                        group?.group_type == 'even'
                          ? evenGroupTimeSlot
                          : group?.group_type == 'sd'
                          ? sdGroupTimeSlot
                          : oddGroupTimeSlot,
                      );
                    }
                  });
                }}>
                <Picker.Item
                  color={
                    colorScheme == 'dark'
                      ? Platform.OS == 'ios'
                        ? 'black'
                        : 'white'
                      : 'black'
                  }
                  label="Please Select a page"
                  value={null}
                />
                {allGroups.length ? (
                  allGroups?.map((group, i) => (
                    <Picker.Item
                      key={i}
                      color={
                        colorScheme == 'dark'
                          ? Platform.OS == 'ios'
                            ? 'black'
                            : 'white'
                          : 'black'
                      }
                      label={`${group?.name} ( ${
                        group?.group_type == 'even'
                          ? 'Normal Hours'
                          : group?.group_type == 'sd'
                          ? 'Shoppers Darbar'
                          : 'Odd Hours'
                      }  )`}
                      value={group?.id}
                    />
                  ))
                ) : (
                  <Picker.Item
                    label={'You have not assigned to any page'}
                    color={
                      colorScheme == 'dark'
                        ? Platform.OS == 'ios'
                          ? 'black'
                          : 'white'
                        : 'black'
                    }
                    value={null}
                  />
                )}
              </Picker>
            </View>
            {/* select date  */}

            {/* all dates  */}
            <View style={{marginTop: 20}}>
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
            <Text style={{fontWeight: '600', marginTop: 15, marginBottom: 10}}>
              Pick a time slot
            </Text>
            <TimeSlotBar header leftContent="Time" rightContent="Slot" />
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="#ffb800"
                style={{marginTop: 20}}
              />
            ) : selectedGroup && selectedDate ? (
              errorInBookingSlots ? (
                <>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 20,
                      fontSize: 16,
                      fontWeight: '600',
                      color: 'red',
                    }}>
                    {errorInBookingSlots}
                  </Text>
                </>
              ) : (
                timeSlots?.map((slot, i) => (
                  <TimeSlotBar
                    key={i}
                    date={selectedDate}
                    plan={selectedPlan}
                    groupId={selectedGroup}
                    slot={slot}
                    leftContent={slot.time}
                    rightContent={
                      bookedSlots.findIndex(x => x.hour == slot.startTime) != -1
                        ? 'Not Available'
                        : 'Available'
                    }
                    navigation={navigation}
                  />
                ))
              )
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                Pick a page first
              </Text>
            )}
            {/* for margin in bottom  */}
            <View style={{height: 50}}></View>
          </>
        )}
      </View>

      {/* <Footer navigation={navigation} /> */}
    </ScrollView>
  );
}

export default BookSlot;
