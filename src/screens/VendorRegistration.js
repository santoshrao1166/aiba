import React, {useEffect, useState} from 'react';
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
  Image,
  Linking
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios, {axiosGet} from '../axios';
import MultiSelect from '../components/useFulCompo/MultiSelect';
import PickerCompo from '../components/useFulCompo/PickerCompo';
import Input from '../components/useFulCompo/Input';
// Import Document Picker
import DocumentPicker from 'react-native-document-picker';
import {useDispatch} from 'react-redux';
import {getTrackingPermissionStatus} from '../importantFeatures';

const {width} = Dimensions.get('window');

function VendorRegistration({navigation}) {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [registerData, setregisterData] = useState({
    state: '',
    city: '',
    // 'category[]': [],
    category: null,
    name: '',
    brand_name: '',
    aadhar_no: '',
    aadhar_photo: null,
    profile_image: null,
    bank_details: '',
    ifsc: '',
    fb_prof_link: '',
    fb_page_link: '',
    insta_link: '',
    whatsapp_no: '',
    calling_no: '',
    email_id: '',
    password_confirm: '',
    password: '',
    gst_no: '',
    current_address: '',
    pin_code: '',
    bio: '',
    accept: '',
  });
  const [allStates, setallStates] = useState([]);
  const [categories, setcategories] = useState([]);
  const [isSubmitting, setisSubmitting] = useState(false);
  const dispatch = useDispatch();
  //reload screen on each blur   ------------------>
  useEffect(() => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
      'Warning: Failed prop type: Invalid prop `selectedItems` of type `string` supplied to `MultiSelect`, expected `array`.',
    ]);
  }, []);
  //reload screen on each blur    ------------------>

  const getAllState = async isMounted => {
    axiosGet(
      'user/get_states',
      allState => {
        if (!isMounted) return;
        allState = allState.map(s => {
          return {label: s.state_name, value: s.state_id};
        });
        setallStates(allState);
      },
      null,
      navigation,
      dispatch,
    );
  };
  const getcategory = async isMounted => {
    axiosGet(
      'user/all_categories_master',
      ctgArray => {
        // console.log(ctgArray);
        if (isMounted) {
          ctgArray = ctgArray.map(ctg => {
            return {label: ctg?.name, value: ctg?.id};
          });
          setcategories(ctgArray);
        }
      },
      null,
      navigation,
      dispatch,
    );
  };
  //get all category and all state at the whole component did render
  useEffect(() => {
    let isMounted = true;
    getAllState(isMounted);
    getcategory(isMounted);
    return () => {
      isMounted = false;
      setallStates([]);
      setcategories([]);
    };
  }, []);

  const validateForm = () => {
    if (registerData.name == '') {
      Alert.alert('', "Name field can't be empty.");
      return false;
    }
    if (registerData.brand_name == '') {
      Alert.alert('', "Brand name field can't be empty.");
      return false;
    }
    if (registerData.aadhar_no.length != 12) {
      Alert.alert('', 'Aadhar number must be 12 digit long.');
      return false;
    }
    if (registerData.aadhar_photo == null) {
      Alert.alert('', 'Aadhar photo is required.');
      return false;
    }
    if (registerData.profile_image == null) {
      Alert.alert('', 'profile image is required');
      return false;
    }
    if (registerData.whatsapp_no.length != 10) {
      Alert.alert('', 'Whatsapp number must be 10 digit long');
      return false;
    }
    if (registerData.calling_no.length != 10) {
      Alert.alert('', 'Phone number must be 10 digit long');
      return false;
    }
    if (registerData.email_id == '') {
      Alert.alert('', "Email id field can't be empty");
      return false;
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!registerData.email_id.match(mailformat)) {
      Alert.alert('', 'Your email id is not a valid Email Type');
      return false;
    }
    if (registerData.password == '') {
      Alert.alert('', "Password field can't be empty");
      return false;
    }
    if (registerData.password_confirm == '') {
      Alert.alert('', "Confirm password field can't be empty");
      return false;
    }

    if (registerData.password.length < 8) {
      Alert.alert('', 'Your Password must be atleast 8 charactor long');
      return false;
    }
    if (registerData.password !== registerData.password_confirm) {
      Alert.alert('', 'Your Password must be same as confirm password.');
      return false;
    }
    if (registerData.current_address == '') {
      Alert.alert('', "Current address field can't be empty");
      return false;
    }

    if (registerData.state == '') {
      Alert.alert('', "State field can't be empty");
      return false;
    }
    if (registerData.city == '') {
      Alert.alert('', "City field can't be empty");
      return false;
    }

    if (registerData.pin_code.length != 6) {
      Alert.alert('', 'Pin Code must be 6 digit long');
      return false;
    }
    if (registerData.gst_no != '' && registerData.gst_no.length != 15) {
      Alert.alert('', 'Your GST number must be 15 character long.');
      return false;
    }
    if (!registerData['category']) {
      Alert.alert('', 'Select one category.');
      return false;
    }
    if (registerData.bio == '') {
      Alert.alert('', "Bio field can't be empty");
      return false;
    }
    if (toggleCheckBox === false || getTrackingPermissionStatus() == false) {
      Alert.alert(
        '',
        Platform.OS == 'ios'
          ? 'You need to accept our terms and conditions and give tracking permission before proceed for that go to Settings -> Privacy -> Tracking and turn on permission for AIBA.'
          : 'You need to accept our terms and conditions before proceed',
          [{
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return false;
    }

    return true;
  };
  //handle submit function onclick of submit button
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    } else {
      setisSubmitting(true);
    }
    let data = new FormData();
    for (let key in registerData) {
      // if (key == 'category[]') {
      //   let ctgs = registerData['category[]'];
      //   for (let idx in ctgs) {
      //     data.append('category[]', ctgs[idx]);
      //   }
      //   continue;
      // }

      data.append(key, registerData[key]);
    }
    console.log(data);
    try {
      let resData = await axios.post('user/user_vendor_registration', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setisSubmitting(false);
      resData = await resData.data;
      console.log(resData);
      if (resData.status == 0) {
        Alert.alert('Registrastion Failed', resData?.error);
      }

      if (resData.status == -2) {
        let validationData = resData.validation_array;
        for (let key in validationData) {
          Alert.alert('Please check details', validationData[key]);
          return;
        }
      }

      if (resData.status === 1) {
        Alert.alert(
          'Registration Successful',
          'Wait for admin authorisation, Check your mail for the authentication updates.',
        );
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Error in signup', error);
    }
  };

  // pick document from phone
  const pickImage = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      // Setting the state to show single file attributes
      let doc = res[0];
      setregisterData(pre => {
        return {
          ...pre,
          aadhar_photo: doc,
          // aadhar_photo_ext: extention,
        };
      });
    } catch (err) {
      setregisterData(pre => {
        return {
          ...pre,
          aadhar_photo: null,
        };
      });
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  // pick document from phone
  const pickImageProfile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      let doc = res[0];
      console.log(doc);
      setregisterData(pre => {
        return {
          ...pre,
          profile_image: doc,
        };
      });
    } catch (err) {
      setregisterData(pre => {
        return {
          ...pre,
          profile_image: null,
        };
      });
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  // accept terms and condition in ios
  const acceptTermsFunction = async newValue => {
    if (Platform.OS != 'ios') {
      setToggleCheckBox(newValue);
      return;
    }
    if (!newValue) {
      setToggleCheckBox(newValue);
      return;
    }
    try {
      let TrackingPermissionIos = await getTrackingPermissionStatus();
      console.log(TrackingPermissionIos);
      if (TrackingPermissionIos) {
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

        <View style={{marginHorizontal: width * 0.1, flex: 1}}>
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
              <View
                style={{
                  marginLeft: 20,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 27,
                    fontWeight: '700',
                    paddingBottom: 7,
                  }}>
                  Vendor Registration
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
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, name: val};
                  });
                }}
                placeholder="Name"
              />
              {/* Brand Name */}
              <Input
                label="Brand name"
                required
                value={registerData.brand_name}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, brand_name: val};
                  });
                }}
                placeholder="Brand name"
              />
              {/* Aadhaar no and image in a row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {/* Aadhaar Number */}
                <View style={{flex: 1, marginRight: 10}}>
                  <Input
                    label="Aadhaar Number"
                    required
                    value={registerData.aadhar_no}
                    onChangeText={val => {
                      setregisterData(pre => {
                        return {...pre, aadhar_no: val};
                      });
                    }}
                    keyboardType="numeric"
                    maxLength={12}
                    placeholder="Aadhaar Number"
                    massageForInput={`Please enter your aadhaar card number without spaces.\n( Don’t worry, Aadhaar and Bank card details are taken only for security and authentication reasons)`}
                  />
                </View>
                {/* aadhaar image  */}

                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    backgroundColor: '#EEECF1',
                    borderRadius: 5,
                    paddingVertical: 7,
                    width: 110,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    Upload
                  </Text>
                </TouchableOpacity>
              </View>
              {registerData?.aadhar_photo?.name ? (
                <Text style={{fontSize: 8, color: '#4E4957'}}>
                  {'selected photo : ' + registerData?.aadhar_photo?.name}
                </Text>
              ) : null}
              <Text
                style={{color: '#4E4957', marginVertical: 10, fontSize: 10}}>
                *Upload your scanned aadhaar card (size must be less than 1MB)
              </Text>
              {/* profile image  */}
              <View>
                {registerData?.profile_image?.uri ? (
                  <Image
                    style={{
                      width: width * 0.5,
                      height: width / 2,
                      marginVertical: 10,
                    }}
                    source={{uri: registerData?.profile_image?.uri}}
                  />
                ) : null}

                <TouchableOpacity
                  onPress={pickImageProfile}
                  style={{
                    backgroundColor: '#EEECF1',
                    borderRadius: 5,
                    paddingVertical: 7,
                    marginTop: 10,
                    // width: 110,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    Upload profile image
                  </Text>
                </TouchableOpacity>
                {registerData?.profile_image?.name ? (
                  <Text style={{fontSize: 8, color: '#4E4957'}}>
                    {'selected profile image : ' +
                      registerData?.profile_image?.name}
                  </Text>
                ) : null}
              </View>

              {/* acc no  */}
              <Input
                label="Account Number"
                value={registerData.bank_details}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, bank_details: val};
                  });
                }}
                keyboardType="numeric"
                placeholder="Account Number"
              />
              {/* ifsc  */}
              <Input
                label="IFSC"
                value={registerData.ifsc}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, ifsc: val};
                  });
                }}
                placeholder="IFSC"
              />
              {/* fb profile  */}
              <Input
                label="Facebook profile link"
                value={registerData.fb_prof_link}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, fb_prof_link: val};
                  });
                }}
                placeholder="Facebook profile link"
                keyboardType="url"
                massageForInput="Please go to your facebook profile, Click 3 dots and scroll bottom to copy profile link"
              />
              {/* fb page  */}
              <Input
                label="Facebook page link"
                value={registerData.fb_page_link}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, fb_page_link: val};
                  });
                }}
                placeholder="Facebook page link"
                keyboardType="url"
                massageForInput="Please go to your page, Click more and select “Copy page link”"
              />
              {/* ig link  */}
              <Input
                label="Instagram link"
                value={registerData.insta_link}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, insta_link: val};
                  });
                }}
                placeholder="Instagram link"
                keyboardType="url"
              />
              {/* phone and wa no in a row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}>
                {/* wa no.  */}
                <View style={{flex: 1, marginRight: 10}}>
                  <Input
                    label="Whatsapp Number"
                    required
                    value={registerData.whatsapp_no}
                    onChangeText={val => {
                      setregisterData(pre => {
                        return {...pre, whatsapp_no: val};
                      });
                    }}
                    placeholder="Whatsapp Number"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                {/* phone num   */}
                <View style={{flex: 1}}>
                  <Input
                    label="Phone Number"
                    required
                    value={registerData.calling_no}
                    onChangeText={val => {
                      setregisterData(pre => {
                        return {...pre, calling_no: val};
                      });
                    }}
                    placeholder="Phone Number"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
              </View>
              {/* email id  */}
              <Input
                label="Email Address"
                required
                value={registerData.email_id}
                onChangeText={val => {
                  val.toLocaleLowerCase(); //make it lowercase for sake of future
                  setregisterData(pre => {
                    return {...pre, email_id: val};
                  });
                }}
                placeholder="Email Address"
              />
              {/* password  */}
              <Input
                label="Password"
                required
                value={registerData.password}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, password: val};
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
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, password_confirm: val};
                  });
                }}
                placeholder="Confirm password"
                secureTextEntry
              />
              {/* gst not required but if given must be 15 charactor long  */}
              <Input
                label="GST number"
                value={registerData.gst_no}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, gst_no: val};
                  });
                }}
                maxLength={15}
                placeholder="GST number"
              />
              {/* address  */}
              <Input
                label="Current address"
                required
                value={registerData.current_address}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, current_address: val};
                  });
                }}
                placeholder="Current address"
                multiline
              />
              {/* pickers state and city  */}
              {/* state  */}
              {/* <Picker  > 
              </Picker> */}
              <PickerCompo
                data={allStates}
                showLabel="State"
                required
                selectedValue={registerData.state}
                onValueChange={val => {
                  setregisterData(pre => {
                    return {
                      ...pre,
                      state: val,
                    };
                  });
                }}
                Placeholder="Please select your state"
              />
              {/* city  */}
              <Input
                label="City"
                required
                value={registerData.city}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, city: val};
                  });
                }}
                placeholder="City"
              />
              {/* pincode  */}
              <Input
                label="Pin Code"
                required
                value={registerData.pin_code}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, pin_code: val};
                  });
                }}
                placeholder="Pin Code"
                maxLength={6}
                keyboardType="numeric"
              />
              {/* product category picker  */}
              <PickerCompo
                data={categories}
                showLabel="Product Category"
                required
                selectedValue={registerData.category}
                onValueChange={val => {
                  setregisterData(pre => {
                    return {
                      ...pre,
                      category: val,
                    };
                  });
                }}
                mode="dropdown"
                Placeholder="Please select a category"
              />
              {/* <View>
                <View style={styles.inputMainView}>
                  <Text style={styles.label}>Product Category</Text>
                  <Entypo name="star" size={8} color="red" />
                </View>
                <MultiSelect
                  items={categories}
                  onSelectedItemsChange={selectedItems => {
                    setregisterData(pre => {
                      return {
                        ...pre,
                        'category[]': selectedItems,
                      };
                    });
                  }}
                  selectedItems={registerData['category[]']}
                />
              </View> */}

              {/* bio  */}
              <Input
                label="Bio"
                required
                value={registerData.bio}
                onChangeText={val => {
                  setregisterData(pre => {
                    return {...pre, bio: val};
                  });
                }}
                placeholder="Bio"
                multiline
                massageForInput=" Please enter a brief introduction about yourself and your business for our better understanding."
              />
              {/* <Text>{registerData.bio}</Text> */}
              {/* check box for accept terms */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <CheckBox
                  style={styles.checkBox}
                  tintColors={{true: '#FF9330', false: '#787885'}}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => acceptTermsFunction(newValue)}
                />
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 10}}>I accept </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Terms', {
                        fromRegistration: true,
                      });
                    }}>
                    <Text style={{fontSize: 10, color: 'blue'}}>
                      terms and conditions{' '}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{fontSize: 10}}>in registration form.</Text>
                </View>
              </View>
              {/* register button  */}
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: '#FF9330',
                    paddingVertical: 12,
                    paddingHorizontal: 50,
                    borderRadius: 5,
                    width: 175,
                  }}>
                  <Text
                    style={{fontSize: 18, fontWeight: '600', color: 'white'}}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
              {/* already registered massage  */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 50,
                }}>
                <Text
                  style={{
                    alignItems: 'center',
                  }}>
                  Already registered?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={{paddingHorizontal: 10}}>
                  <Text style={{color: '#FF9330'}}> Login </Text>
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
    flexDirection: 'row',
    marginTop: 20,
    color: 'black',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderStyle: 'solid',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 2,
    color: '#8f9194',
    // elevation: 1,
  },
  pickerBorder: {
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderStyle: 'solid',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 10,
    // elevation: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  checkBox: {
    color: 'white',
    tintColor: '#FF9330',
    marginRight: Platform.OS == 'ios' ? 15 : null,
  },
});

export default VendorRegistration;

const Loader = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
      }}>
      <ActivityIndicator size={40} color="black" />
    </View>
  );
};
