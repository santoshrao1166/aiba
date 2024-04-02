import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BookingDetails, {
  BookingDetailsHeader,
} from '../components/BookingDetails';
// import ModalDropdown from 'react-native-modal-dropdown';
import axios, {axiosGet} from '../axios';
import {useDispatch} from 'react-redux';
const {height, width} = Dimensions.get('window');

function MyBooking({navigation}) {
  const [isUpcoming, setisUpcoming] = useState(true);
  const [isOtherUpcoming, setisOtherUpcoming] = useState(true);
  const [upcomingBookings, setupcomingBookings] = useState([]);
  const [historyBooking, sethistoryBooking] = useState([]);
  const [anotherUpcomingBookings, setanotherUpcomingBookings] = useState([]);
  const [anotherHistoryBooking, setanotherHistoryBooking] = useState([]);
  const dispatch = useDispatch();
  //get all upcomming bookings of user
  const getBookings = async () => {
    axiosGet(
      'user/user_bookings',
      bookings => {
        setupcomingBookings(bookings?.upcoming_bookings);
        sethistoryBooking(bookings?.past_bookings);
        // console.log(bookings);
      },
      null,
      navigation,
      dispatch,
    );
  };
  //get all upcomming bookings of user
  const getOtherBookings = async () => {
    axiosGet(
      'user/user_another_bookings',
      bookings => {
        setanotherUpcomingBookings(bookings?.upcoming_bookings);
        setanotherHistoryBooking(bookings?.past_bookings);
        // console.log(bookings, 'another');
      },
      null,
      navigation,
      dispatch,
    );
  };
  useEffect(() => {
    let interval = setInterval(() => {
      console.log('again');
      getBookings();
      getOtherBookings();
    }, 5000);
    navigation.addListener('blur', () => {
      clearInterval(interval);
    });
    return () => {
      clearInterval(interval);
    };
  }, [navigation]);
  // reload each time
  useEffect(() => {
    const reload = navigation.addListener('focus', () => {
      getOtherBookings();
      getBookings();
    });
    return reload;
  }, [navigation]);
  return (
    <ScrollView
      style={{backgroundColor: 'white', height: height}}
      showsVerticalScrollIndicator={false}>
      {/* <StatusBar backgroundColor="white" /> */}
      {/* back and hambuger */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: height * 0.1,
          alignItems: 'center',
          marginHorizontal: width * 0.05,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons name="arrow-back-ios" size={25} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <FontAwesome5 name="bars" size={25} style={{marginLeft: 24}} />
        </TouchableOpacity>
      </View>

      {/* remaining body is in this view  */}
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,

          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: height * 0.04, fontWeight: '700'}}>
          My Bookings
        </Text>

        {/* tabs for upcoming and History  and select dates*/}
        <View
          style={{
            flexDirection: 'row',
            height: 70,
            height: height * 0.06,
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => setisUpcoming(true)}>
              <View
                style={
                  isUpcoming
                    ? {
                        borderBottomColor: '#FFB800',
                        borderBottomWidth: 3,
                        paddingHorizontal: 10,
                        paddingBottom: 3,
                      }
                    : {paddingHorizontal: 10}
                }>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: isUpcoming ? 'black' : '#787885',
                  }}>
                  Upcoming
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setisUpcoming(false)}>
              <View
                style={
                  isUpcoming
                    ? {paddingHorizontal: 10}
                    : {
                        borderBottomColor: '#FFB800',
                        borderBottomWidth: 3,
                        paddingHorizontal: 10,
                        paddingBottom: 3,
                      }
                }>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: isUpcoming ? '#787885' : 'black',
                  }}>
                  History
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* <ModalDropdown
            options={['Months', 'Year', 'Date']}
            dropdownStyle={{
              width: 80,
              height: 130,
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              borderRadius: 10,
              paddingVertical: 7,
            }}
            dropdownTextStyle={{
              fontSize: 13,
              fontWeight: '600',
              textAlign: 'center',
            }}
            showsVerticalScrollIndicator={false}>
            <FontAwesome5 name="sliders-h" size={25} />
          </ModalDropdown> */}
        </View>
      </View>

      {/* all bookings are here */}
      <View style={{marginHorizontal: width * 0.05, marginTop: 10}}>
        {/* <Text style={{fontSize: 18, fontWeight: '500', marginLeft: 35}}>
          2021
        </Text> */}
        <ScrollView horizontal>
          <View>
            {isUpcoming ? (
              <>
                <BookingDetailsHeader />

                {upcomingBookings.length ? (
                  <>
                    <FlatList
                      data={upcomingBookings}
                      renderItem={(booking, i) => (
                        <BookingDetails
                          key={i}
                          getBookings={getBookings}
                          booking={booking.item}
                          navigation={navigation}
                        />
                      )}
                    />
                  </>
                ) : (
                  <Text
                    style={{fontSize: 20, marginTop: 40, textAlign: 'left'}}>
                    No upcoming bookings
                  </Text>
                )}
              </>
            ) : (
              <>
                <BookingDetailsHeader history />

                {historyBooking.length ? (
                  <FlatList
                    data={historyBooking}
                    renderItem={(booking, i) => (
                      <BookingDetails
                        key={i}
                        history
                        getBookings={getBookings}
                        booking={booking.item}
                        navigation={navigation}
                      />
                    )}
                  />
                ) : (
                  <Text
                    style={{fontSize: 20, marginTop: 40, textAlign: 'left'}}>
                    No booking in history
                  </Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>

      {/* other person bookings are here  */}

      {/* remaining body is in this view  */}
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,

          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Text
          style={{fontSize: height * 0.04, fontWeight: '700', marginTop: 35}}>
          Another Bookings
        </Text>

        {/* tabs for upcoming and History  and select dates*/}
        <View
          style={{
            flexDirection: 'row',
            height: 70,
            height: height * 0.06,
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => setisOtherUpcoming(true)}>
              <View
                style={
                  isOtherUpcoming
                    ? {
                        borderBottomColor: '#FFB800',
                        borderBottomWidth: 3,
                        paddingHorizontal: 10,
                        paddingBottom: 3,
                      }
                    : {paddingHorizontal: 10}
                }>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: isOtherUpcoming ? 'black' : '#787885',
                  }}>
                  Upcoming
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setisOtherUpcoming(false)}>
              <View
                style={
                  isOtherUpcoming
                    ? {paddingHorizontal: 10}
                    : {
                        borderBottomColor: '#FFB800',
                        borderBottomWidth: 3,
                        paddingHorizontal: 10,
                        paddingBottom: 3,
                      }
                }>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: isOtherUpcoming ? '#787885' : 'black',
                  }}>
                  History
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* all bookings are here */}
      <View style={{marginHorizontal: width * 0.05, marginTop: 10}}>
        <ScrollView horizontal>
          {isOtherUpcoming ? (
            <View>
              <BookingDetailsHeader />

              {anotherUpcomingBookings.length ? (
                <>
                  <FlatList
                    data={anotherUpcomingBookings}
                    renderItem={(booking, i) => (
                      <BookingDetails
                        key={i}
                        getBookings={getOtherBookings}
                        booking={booking.item}
                        navigation={navigation}
                        other
                      />
                    )}
                  />
                </>
              ) : (
                <Text style={{fontSize: 20, marginTop: 40, textAlign: 'left'}}>
                  No upcoming bookings
                </Text>
              )}
            </View>
          ) : (
            <>
              <View>
                <BookingDetailsHeader history />

                {anotherHistoryBooking.length ? (
                  <FlatList
                    data={anotherHistoryBooking}
                    renderItem={(booking, i) => (
                      <BookingDetails
                        key={i}
                        history
                        getBookings={getOtherBookings}
                        booking={booking.item}
                        navigation={navigation}
                        other
                      />
                    )}
                  />
                ) : (
                  <Text
                    style={{fontSize: 20, marginTop: 40, textAlign: 'left'}}>
                    No bookings in history
                  </Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputAndEditView: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
  },
  input: {
    width: width * 0.55,
    color: 'black',
    opacity: 0.5,
  },
});
export default MyBooking;
