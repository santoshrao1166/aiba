import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  LogBox,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import Header from "../../components/Header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "../../axios";
import Input from "../../components/useFulCompo/Input";
import { useDispatch } from "react-redux";
import { getTrackingPermissionStatus } from "../../importantFeatures";

const { width } = Dimensions.get("window");

function Signup({ navigation }) {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [registerData, setregisterData] = useState({
    name: "",
    mobile: "",
    email_id: "",
    password_confirm: "",
    password: "",
  });
  const [isSubmitting, setisSubmitting] = useState(false);
  //reload screen on each blur   ------------------>
  useEffect(() => {
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested",
      "Warning: Failed prop type: Invalid prop `selectedItems` of type `string` supplied to `MultiSelect`, expected `array`.",
    ]);
  }, []);
  //reload screen on each blur    ------------------>

  const validateForm = () => {
    if (registerData.name == "") {
      Alert.alert("", "Name field can't be empty");
      return false;
    }

    if (registerData.mobile.length != 10) {
      Alert.alert("", "Phone number must be 10 digit long");
      return false;
    }
    if (registerData.email_id == "") {
      Alert.alert("", "Email id field can't be empty");
      return false;
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!registerData.email_id.match(mailformat)) {
      Alert.alert("", "Your email id is not a valid Email Type");
      return false;
    }
    if (registerData.password == "") {
      Alert.alert("", "Password field can't be empty");
      return false;
    }
    if (registerData.password_confirm == "") {
      Alert.alert("", "Confirm password field can't be empty");
      return false;
    }

    if (registerData.password.length < 8) {
      Alert.alert("", "Your Password must be atleast 8 charactor long");
      return false;
    }
    if (registerData.password !== registerData.password_confirm) {
      Alert.alert("", "Your Password must be same as confirm password.");
      return false;
    }

    if (toggleCheckBox === false || getTrackingPermissionStatus() == false) {
      Alert.alert(
        "",
        Platform.OS == "ios"
          ? "You need to accept our terms and conditions and give tracking permission before proceed for that go to Settings -> Privacy -> Tracking and turn on permission for AIBA."
          : "You need to accept our terms and conditions before proceed",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () =>
              Platform.OS == "ios" ? Linking.openSettings() : null,
          },
        ]
      );
      return false;
    }

    return true;
  };
  //handle submit function onclick of submit button
  const handleSubmit = async () => {
    // console.log(registerData);
    // return;
    if (!validateForm()) {
      return;
    }
    setisSubmitting(true);
    let data = new FormData();
    for (let key in registerData) {
      data.append(key, registerData[key]);
    }
    console.log(data);
    try {
      let resData = await axios.post("user/customer_reg", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setisSubmitting(false);
      resData = await resData.data;
      console.log(resData);
      if (resData.status == 0) {
        Alert.alert("Registrastion Failed", resData?.error);
      }

      if (resData.status == -2) {
        let validationData = resData.validation_array;
        for (let key in validationData) {
          Alert.alert("Please check details", validationData[key]);
          return;
        }
      }

      if (resData.status === 1) {
        Alert.alert(
          "Registration Successful",
          "Login using email id and password"
        );
        navigation.navigate("Customer Login");
      }
    } catch (error) {
      Alert.alert("Error in signup", error);
    }
  };
  const acceptTermsFunction = async (newValue) => {
    if (Platform.OS != "ios") {
      setToggleCheckBox(newValue);
      return;
    }
    if (!newValue) {
      setToggleCheckBox(newValue);
      return;
    }
    try {
      let TrackingPermissionIos = await getTrackingPermissionStatus();
      if (TrackingPermissionIos) {
        console.log(TrackingPermissionIos);
        setToggleCheckBox(newValue);
        return;
      }
      // Alert.alert(
      //   'Tracking permission required',
      //   'You need to give tracking permission to signup to AIBA.',
      // );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ScrollView backgroundColor="white" showsVerticalScrollIndicator={false}>
        {/* <StatusBar backgroundColor="white" barStyle="dark-content" /> */}
        <Header navigation={navigation} />

        <View style={{ marginHorizontal: width * 0.1, flex: 1 }}>
          {/* top arrow and text  */}
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
                  marginLeft: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 27,
                    fontWeight: "700",
                    paddingBottom: 7,
                  }}
                >
                  Customer Registration
                </Text>
              </View>
            </View>
          </View>

          {isSubmitting == true ? (
            <Loader />
          ) : (
            <>
              {/* all inputs in registration  */}
              {/* name of vendor  */}
              <Input
                label="Name"
                required
                value={registerData.name}
                onChangeText={(val) => {
                  setregisterData((pre) => {
                    return { ...pre, name: val };
                  });
                }}
                placeholder="Name"
              />

              {/* phone and wa no in a row */}

              <Input
                label="Phone Number"
                required
                value={registerData.mobile}
                onChangeText={(val) => {
                  setregisterData((pre) => {
                    return { ...pre, mobile: val };
                  });
                }}
                placeholder="Phone Number"
                keyboardType="numeric"
                maxLength={10}
              />

              {/* email id  */}
              <Input
                label="Email Address"
                required
                value={registerData.email_id}
                onChangeText={(val) => {
                  val.toLocaleLowerCase(); //make it lowercase for sake of future
                  setregisterData((pre) => {
                    return { ...pre, email_id: val };
                  });
                }}
                placeholder="Email Address"
              />
              {/* password  */}
              <Input
                label="Password"
                required
                value={registerData.password}
                onChangeText={(val) => {
                  setregisterData((pre) => {
                    return { ...pre, password: val };
                  });
                }}
                placeholder="Password"
                secureTextEntry
                massageForInput="Create password for this app"
              />
              {/* confirm Pass  */}
              <Input
                label="Confirm password"
                required
                value={registerData.password_confirm}
                onChangeText={(val) => {
                  setregisterData((pre) => {
                    return { ...pre, password_confirm: val };
                  });
                }}
                placeholder="Confirm password"
                secureTextEntry
              />

              {/* check box for accept terms */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <CheckBox
                  style={styles.checkBox}
                  tintColors={{ true: "#FF9330", false: "#787885" }}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => acceptTermsFunction(newValue)}
                />
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 10 }}>I accept </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Terms", {
                        fromRegistration: true,
                      });
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "blue" }}>
                      terms and conditions{" "}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 10 }}>in registration form.</Text>
                </View>
              </View>
              {/* register button  */}
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: "#FF9330",
                    paddingVertical: 12,
                    paddingHorizontal: 50,
                    borderRadius: 5,
                    width: 175,
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "600", color: "white" }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
              {/* already registered massage  */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 50,
                }}
              >
                <Text
                  style={{
                    alignItems: "center",
                  }}
                >
                  Already registered?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Customer Login")}
                  style={{ paddingHorizontal: 10 }}
                >
                  <Text style={{ color: "#FF9330" }}> Login </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  inputMainView: {
    flexDirection: "row",
    marginTop: 20,
    color: "black",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
  },
  textInput: {
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderStyle: "solid",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 2,
    color: "#8f9194",
    // elevation: 1,
  },
  pickerBorder: {
    borderColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderStyle: "solid",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 10,
    // elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  checkBox: {
    color: "white",
    tintColor: "#FF9330",
    marginRight: Platform.OS == "ios" ? 15 : null,
  },
});

export default Signup;

const Loader = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
      }}
    >
      <ActivityIndicator size={40} color="black" />
    </View>
  );
};
