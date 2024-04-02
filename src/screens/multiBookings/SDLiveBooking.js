import React, { useEffect, useState } from "react";
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
  Linking,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios, { axiosGet } from "../../axios";
import { useDispatch } from "react-redux";
import Buffer from "buffer";
import { months } from "../../importantFeatures";
import { serverEndPoint } from "../../config";
const buffer = Buffer.Buffer;

const { height, width } = Dimensions.get("window");

function MultiSdBooking({ navigation }) {
  const [upcomingBookings, setupcomingBookings] = useState([]);
  const [slotView, setSlotView] = useState([]);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  //get all upcomming bookings of user
  const getBookings = async () => {
    axiosGet(
      "user/user_multi_bookings?type=sd",
      (bookings) => {
        setupcomingBookings(bookings.bookings);
        // sethistoryBooking(bookings?.past_bookings);
      },
      null,
      navigation,
      dispatch
    );
  };
  const showSlots = (booking_id) => {
    axiosGet(
      "user/multi_slot_view?booking_id=" + booking_id,
      (data) => {
        setShow(true);
        setSlotView(data);
      },
      null,
      navigation
    );
  };
  const headers = ["Date", "Time", "Price"];

  useEffect(() => {
    getBookings();
  }, []);
  // reload each time
  useEffect(() => {
    const reload = navigation.addListener("focus", () => {
      getBookings();
    });
    return reload;
  }, [navigation]);
  return (
    <ScrollView
      style={{ backgroundColor: "white", height: height }}
      showsVerticalScrollIndicator={false}
    >
      {/* back and hambuger */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: height * 0.1,
          alignItems: "center",
          marginHorizontal: width * 0.05,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <MaterialIcons name="arrow-back-ios" size={25} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <FontAwesome5 name="bars" size={25} style={{ marginLeft: 24 }} />
        </TouchableOpacity>
      </View>

      {/* remaining body is in this view  */}
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,
          marginVertical: 10,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700" }}>
          My Multi Bookings
        </Text>
      </View>

      {/* all bookings are here */}
      <View style={{ marginHorizontal: width * 0.05, marginTop: 10 }}>
        <ScrollView horizontal>
          <SafeAreaView style={{ height: height * 0.7 }}>
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
                      showSlots={showSlots}
                    />
                  )}
                />
              </>
            ) : (
              <Text style={{ fontSize: 20, marginTop: 40, textAlign: "left" }}>
                No SD Live Bookings
              </Text>
            )}
          </SafeAreaView>
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => {
          setShow(false);
        }}
      >
        <View
          style={{
            padding: 20,
            marginTop: height * 0.2,
            marginHorizontal: width * 0.05,
            alignSelf: "center",
            justifyContent: "flex-start",
            height: height * 0.5,
            width: width * 0.8,
            backgroundColor: "lightgrey",
            borderRadius: 12,
          }}
        >
          <ScrollView>
            <TouchableOpacity onPress={() => setShow(false)}>
              <Text style={{ textAlign: "right", fontSize: 20, color: "red" }}>
                x
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                paddingVertical: height * 0.02,
                paddingHorizontal: width * 0.02,
              }}
            >
              Slot Summary
            </Text>
            <View
              style={{
                borderBottomColor: "lightgrey",
                borderBottomWidth: 2,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {headers.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.row,
                      {
                        width: width * 0.2,
                        height: 40,
                        justifyContent: "flex-start",
                        color: "#FF9432",
                      },
                    ]}
                  >
                    <Text style={styles.centeredText}>{item}</Text>
                  </View>
                );
              })}
            </View>

            <View
              style={{
                borderBottomColor: "lightgrey",
                borderBottomWidth: 2,
              }}
            />
            <View>
              {slotView.map((element, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View
                      style={[
                        styles.row,
                        {
                          width: width * 0.2,
                          height: 40,
                          justifyContent: "flex-start",
                        },
                      ]}
                    >
                      <Text style={styles.centeredText}>
                        {element.date}-{element.month}-{element.year}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {
                          width: width * 0.2,
                          height: 40,
                          justifyContent: "flex-start",
                        },
                      ]}
                    >
                      <Text style={styles.centeredText}>
                      {(element.hour == 12)?12:element.hour % 12}{" "}
                    {parseInt(element.hour) < 12 ? "AM" : "PM"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.row,
                        {
                          width: width * 0.2,
                          height: 40,
                          justifyContent: "flex-start",
                        },
                      ]}
                    >
                      <Text style={styles.centeredText}>{element.amount}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* { show?
     :null} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputAndEditView: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#F2F2F2",
    borderBottomWidth: 1,
  },
  input: {
    width: width * 0.55,
    color: "black",
    opacity: 0.5,
  },
  parentView: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "white",
    minHeight: 120,
    marginVertical: 10,
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  inputMainView: { flexDirection: "row", marginTop: 5 },
  modalView: {
    margin: 20,
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ff9330",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonClose: {},
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
  },
  textInput: {
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    // height: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  pickerBorder: {
    borderColor: "#FF9330",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});

const BookingDetailsHeader = () => {
  return (
    <>
      {/* Month Year Amount Invoice */}
      <View
        style={{
          backgroundColor: "#F5F5F5",
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          borderBottomColor: "rgba(0,0,0,0.25)",
          borderBottomWidth: 1.75,
        }}
      >
        <View style={{ width: 100 }}>
          <Text style={{ textAlign: "center" }}>Page Name</Text>
        </View>
        <View style={{ width: 100 }}>
          <Text style={{ textAlign: "center" }}>Amount</Text>
        </View>
        <View style={{ width: 120 }}>
          <Text style={{ textAlign: "center" }}>Status</Text>
        </View>
        <View style={{ width: 100 }}>
          <Text style={{ textAlign: "center" }}>Total Slots</Text>
        </View>
        <View style={{ width: 100 }}>
          <Text style={{ textAlign: "center" }}>Booking</Text>
        </View>
        <View style={{ width: 120 }}>
          <Text style={{ textAlign: "center" }}>Invoice</Text>
        </View>
      </View>
    </>
  );
};

function BookingDetails({
  booking,
  showSlots,
  history,
  getBookings,
  navigation,
  other,
}) {
  const [paid, setpaid] = useState(false);

  useEffect(() => {
    setpaid(booking?.payment_status == "success" ? true : false);
  }, [booking?.payment_status]);

  const getInvoice = () => {
    let invNum = booking?.invoice_no;
    if (invNum) {
      let invBase64 = buffer.from(invNum).toString("base64");
      // console.log(invBase64);
      let invUrl = `${serverEndPoint}user/multi_booking_invoice/${invBase64}`;
      // historyDownload(invUrl);

      Linking.openURL(invUrl);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "rgba(0,0,0,0.25)",
        borderBottomWidth: 0.86,
        backgroundColor:
          booking?.payment_status == "cancelled"
            ? "rgba(256,0,0,0.5)"
            : "white",
      }}
    >
      <View style={{ width: 100 }}>
        <Text style={{ textAlign: "center" }}>{booking?.group_name}</Text>
      </View>

      <View style={{ width: 100 }}>
        <Text style={{ textAlign: "center" }}>
          {booking?.payment_type == "free" ? null : (
            <FontAwesome name="rupee" size={13} />
          )}{" "}
          {booking?.payment_type == "free" ? "Free booking" : booking?.amount}
        </Text>
      </View>
      {booking?.status == "1" ? (
        <View
          style={{ width: 100, backgroundColor: "seagreen", borderRadius: 5 }}
        >
          <Text style={{ textAlign: "center", color: "#ffffff" }}>Success</Text>
        </View>
      ) : (
        <View style={{ width: 100, backgroundColor: "red", borderRadius: 5 }}>
          <Text style={{ textAlign: "center", color: "#ffffff" }}>Fail</Text>
        </View>
      )}
      <View style={{ width: 100 }}>
        <Text style={{ textAlign: "center" }}>
          {booking?.bookingtime.split(",").length}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => showSlots(booking.booking_id)}
        style={{ width: 100 }}
      >
        <Text style={{ textAlign: "center", color: "blue" }}>View</Text>
      </TouchableOpacity>
      <View
        style={{ width: 120, justifyContent: "center", flexDirection: "row" }}
      >
          {booking.invoice_html == "" ? (
          <>
            <Text style={{ textAlign: "center" }} numberOfLines={2}>
              Not available
            </Text>
          </>
        ) : (
          <TouchableOpacity onPress={getInvoice}>
            <Text
              style={{
                color: "white",
                padding: 5,
                borderRadius: 5,
                backgroundColor: "orange",
                textAlign: "center",
              }}
              numberOfLines={2}
            >
              Download Invoice
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default MultiSdBooking;
