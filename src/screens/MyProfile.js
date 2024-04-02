import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '../redux/action/auth';
import axios, {axiosGet} from '../axios';
import PickerCompo from '../components/useFulCompo/PickerCompo';
import {serverEndPoint} from '../config';
import DocumentPicker from 'react-native-document-picker';

const {height, width} = Dimensions.get('window');

function MyProfile({navigation}) {
  const [editedUser, seteditedUser] = useState(null);
  const [editNotSave, seteditNotSave] = useState(true);
  const [categories, setcategories] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const getcategory = async () => {
    axiosGet(
      'user/all_categories_master',
      ctgArray => {
        ctgArray = ctgArray.map(ctg => {
          return {label: ctg?.name, value: ctg?.id};
        });
        // console.log(ctgArray);
        setcategories(ctgArray);
      },
      null,
      navigation,
      dispatch,
    );
  };
  //check if user is already logined or not otherwise redirect to home page
  useEffect(() => {
    // console.log(serverEndPoint + 'uploads/docs/' + user?.profile_image);
    const getUser = navigation.addListener('focus', async () => {
      seteditedUser(user);
      getcategory();
    });
    return getUser;
  }, [dispatch, navigation]);
  /////////////////////////////////////////////////////////////////
  const validateForm = () => {
    if (editedUser.name == '') {
      Alert.alert('', "Name field can't be empty.");
      return false;
    }
    if (editedUser.whatsapp_no.length != 10) {
      Alert.alert('', 'Whatsapp number must be 10 digit long');
      return false;
    }
    if (editedUser.calling_no.length != 10) {
      Alert.alert('', 'Phone number must be 10 digit long');
      return false;
    }
    if (editedUser.email_id == '') {
      Alert.alert('', "Email id field can't be empty");
      return false;
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!editedUser.email_id.match(mailformat)) {
      Alert.alert('', 'Your email id is not a valid Email Type');
      return false;
    }
    if (editedUser.current_address == '') {
      Alert.alert('', "Address field can't be empty");
      return false;
    }
    if (editedUser.bio == '') {
      Alert.alert('', "Bio field can't be empty");
      return false;
    }

    if (editedUser.gst_no != '' && editedUser.gst_no.length != 15) {
      Alert.alert('', 'Your GST number must be 15 character long.');
      return false;
    }
    if (!editedUser['category']) {
      Alert.alert('', 'Select one category.');
      return false;
    }
    return true;
  };
  const updateProfile = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setisLoading(true);
      let data = new FormData();
      for (let key in editedUser) {
        data.append(key, editedUser[key]);
      }
      let update = await axios.post('/user/update_profile', data, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      update = await update.data;
      setisLoading(false);

      if (update.status === -2) {
        let validationData = update.validation_array;
        for (let key in validationData) {
          Alert.alert('Please check!!!', validationData[key]);
          return;
        }
      }
      if (update.status === -2) {
        Alert.alert('Error', JSON.stringify(update.validation_array));
        return;
      }
      if (update.status === 1) {
        Alert.alert('Details Updated', 'Your details are updated');
        // get user data and store it to async storage then in redux store
        let userData = await axios.get('/user/profile');
        userData = await userData.data;
        AsyncStorage.setItem('aibaUser', JSON.stringify(userData.data));
        dispatch(login(userData.data));
      }
    } catch (error) {
      setisLoading(false);

      console.log(error);
    }
  };

  const pickImage = async path => {
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      // Setting the state to show single file attributes
      let doc = res[0];
      seteditedUser(pre => {
        pre = {
          ...pre,
          [path]: doc,
          // aadhar_photo_ext: extention,
        };
        console.log(pre);
        return pre;
      });
    } catch (err) {
      seteditedUser(pre => {
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
  return isLoading ? (
    <ActivityIndicator color="black" size="large" style={{marginTop: 100}} />
  ) : (
    <ScrollView style={{backgroundColor: '#F2F2F2'}}>
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
          minHeight: height * 0.65,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 30, fontWeight: '700'}}> My Profile </Text>

        {/* profile pic and edit btn */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            marginTop: 20,
            position: 'relative',
          }}>
          <Image
            resizeMode="contain"
            style={{width: 90, height: 90}}
            source={{
              uri: editedUser?.profile_image?.uri
                ? editedUser?.profile_image?.uri
                : user?.profile_image
                ? serverEndPoint + 'uploads/docs/' + user?.profile_image
                : 'https://ui-avatars.com/api/?name=' + user?.name,
            }}
          />
          {!editNotSave ? (
            <TouchableOpacity
              style={{position: 'absolute', right: 0, bottom: 0}}
              onPress={() => pickImage('profile_image')}>
              <MaterialIcons
                style={{
                  backgroundColor: '#FF9330',
                }}
                name="edit"
                size={25}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Catalogue')}
          style={{
            padding: 10,
            marginTop: 20,
            backgroundColor: 'orange',
            borderRadius: 10,
          }}>
          <Text style={{color: 'white'}}>View catalogue</Text>
        </TouchableOpacity>

        {/* below card and diffrent data  */}

        <View style={styles.card}>
          {editNotSave ? (
            <TouchableOpacity
              style={{marginLeft: 'auto', marginRight: 10}}
              onPress={() => {
                seteditNotSave(false);
                seteditedUser(user);
              }}>
              <MaterialIcons name="edit" size={25} color="#FF9330" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{marginLeft: 'auto', marginRight: 10}}
              onPress={() => {
                updateProfile();
                seteditNotSave(true);
              }}>
              <MaterialIcons name="save" size={25} color="#FF9330" />
            </TouchableOpacity>
          )}

          {editNotSave ? (
            <>
              <View style={styles.inputAndEditView}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  editable={false}
                  value={user?.name}
                />
              </View>

              <View style={styles.inputAndEditView}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={user?.email_id}
                  editable={false}
                />
              </View>

              <View style={styles.inputAndEditView}>
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  value={'+91 ' + user?.calling_no}
                  editable={false}
                />
              </View>

              <View style={styles.inputAndEditView}>
                <TextInput
                  placeholder="Address"
                  multiline
                  editable={false}
                  style={styles.input}
                  value={user?.current_address}
                />
              </View>
              <View style={styles.inputAndEditView}>
                <TextInput
                  placeholder="Bio"
                  multiline
                  editable={false}
                  style={styles.input}
                  value={
                    user?.bio || user?.bio != 'null' || user?.bio == 'undefined'
                      ? user?.bio
                      : ''
                  }
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputAndEditView}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={editedUser?.name}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, name: val};
                    })
                  }
                />
              </View>

              <View style={styles.inputAndEditView}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={editedUser?.email_id}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, email_id: val};
                    })
                  }
                />
              </View>

              <View style={styles.inputAndEditView}>
                <Text style={{color: 'black', opacity: 0.5}}>+91 </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  value={editedUser?.calling_no}
                  maxLength={10}
                  keyboardType="number-pad"
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, calling_no: val};
                    })
                  }
                />
              </View>

              <View style={styles.inputAndEditView}>
                <TextInput
                  placeholder="Address"
                  multiline
                  style={styles.input}
                  value={editedUser?.current_address}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, current_address: val};
                    })
                  }
                />
              </View>
              <View style={styles.inputAndEditView}>
                <TextInput
                  placeholder="Bio"
                  multiline
                  style={styles.input}
                  value={editedUser?.bio ? editedUser?.bio : ''}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, bio: val};
                    })
                  }
                />
              </View>
              <View style={styles.inputAndEditView}>
                <PickerCompo
                  data={categories}
                  selectedValue={editedUser.category}
                  onValueChange={val => {
                    seteditedUser(pre => {
                      return {
                        ...pre,
                        category: val,
                      };
                    });
                  }}
                  // mode="dropdown"
                  Placeholder="Please select a category"
                />
              </View>

              <View style={styles.inputAndEditView}>
                <TextInput
                  placeholder="Account number"
                  style={styles.input}
                  value={
                    editedUser?.bank_details ? editedUser?.bank_details : ''
                  }
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, bank_details: val};
                    })
                  }
                />
              </View>
              <View style={styles.inputAndEditView}>
                <TextInput
                  placeholder="Ifsc code"
                  style={styles.input}
                  value={editedUser?.ifsc ? editedUser?.ifsc : ''}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, ifsc: val};
                    })
                  }
                />
              </View>

              <View style={styles.inputAndEditView}>
                <TextInput
                  placeholder="Whatsapp number"
                  style={styles.input}
                  value={editedUser?.whatsapp_no ? editedUser?.whatsapp_no : ''}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, whatsapp_no: val};
                    })
                  }
                />
              </View>

              <View style={styles.inputAndEditView}>
                <TextInput
                  placeholder="GST Number"
                  style={styles.input}
                  maxLength={15}
                  value={editedUser?.gst_no ? editedUser?.gst_no : ''}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, gst_no: val};
                    })
                  }
                />
              </View>
              <View style={styles.inputAndEditView}>
                <Text style={{fontSize: 12, marginTop: 10}}>
                  Facebook profile{' '}
                </Text>
                <TextInput
                  placeholder="Facebook profile link"
                  style={styles.input}
                  maxLength={15}
                  value={
                    editedUser?.fb_prof_link ? editedUser?.fb_prof_link : ''
                  }
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, fb_prof_link: val};
                    })
                  }
                />
              </View>
              <View style={styles.inputAndEditView}>
                <Text style={{fontSize: 12, marginTop: 10}}>
                  Facebook page{' '}
                </Text>

                <TextInput
                  placeholder="Facebook page link"
                  style={styles.input}
                  maxLength={15}
                  value={
                    editedUser?.fb_page_link ? editedUser?.fb_page_link : ''
                  }
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, fb_page_link: val};
                    })
                  }
                />
              </View>
              <View style={styles.inputAndEditView}>
                <Text style={{fontSize: 12, marginTop: 10}}>
                  Instagram link{' '}
                </Text>
                <TextInput
                  placeholder="Instagram link"
                  style={styles.input}
                  maxLength={15}
                  value={editedUser?.insta_link ? editedUser?.insta_link : ''}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, insta_link: val};
                    })
                  }
                />
              </View>
              <View style={styles.inputAndEditView}>
                <Text style={{fontSize: 12, marginTop: 10}}>
                  Aadhar Number{' '}
                </Text>
                <TextInput
                  placeholder="GST Number"
                  style={styles.input}
                  maxLength={12}
                  value={editedUser?.aadhar_no ? editedUser?.aadhar_no : ''}
                  onChangeText={val =>
                    seteditedUser(pre => {
                      return {...pre, aadhar_no: val};
                    })
                  }
                />
              </View>
              {editedUser?.aadhar_photo ? (
                <Image
                  style={{
                    width: width * 0.5,
                    height: width / 2,
                    marginVertical: 10,
                    marginLeft: width * 0.2,
                  }}
                  source={{
                    uri: editedUser?.aadhar_photo?.uri
                      ? editedUser?.aadhar_photo?.uri
                      : serverEndPoint +
                        'uploads/docs/' +
                        editedUser?.aadhar_photo,
                  }}
                />
              ) : null}

              <TouchableOpacity
                onPress={() => pickImage('aadhar_photo')}
                style={{
                  backgroundColor: '#EEECF1',
                  borderRadius: 5,
                  paddingVertical: 7,
                  width: width * 0.7,
                  marginLeft: width * 0.1,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                  Upload Any Govt. ID Proof
                </Text>
              </TouchableOpacity>

              {editedUser?.booking_image ? (
                <Image
                  style={{
                    width: width * 0.5,
                    height: width / 2,
                    marginVertical: 10,
                    marginLeft: width * 0.2,
                  }}
                  source={{
                    uri: editedUser?.booking_image?.uri
                      ? editedUser?.booking_image?.uri
                      : serverEndPoint +
                        'uploads/docs/' +
                        editedUser?.booking_image,
                  }}
                />
              ) : null}

              <TouchableOpacity
                onPress={() => pickImage('booking_image')}
                style={{
                  backgroundColor: '#EEECF1',
                  borderRadius: 5,
                  paddingVertical: 7,
                  width: width * 0.7,
                  marginLeft: width * 0.1,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                  Booking Image
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  (This image will use as thoubnail of your live.)
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* copyright  */}

      <View style={{height: height * 0.2}}>
        <Text
          style={{
            color: '#4E4957',
            textAlign: 'center',
            marginTop: 'auto',
          }}>
          copyright © AIBA
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: width * 0.9,
    marginTop: 30,
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 3, height: 4},
    shadowRadius: 10,
    elevation: 15,
  },
  inputAndEditView: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
  },
  input: {
    color: 'black',
    opacity: 0.5,
    flex: 1,
  },
});
export default MyProfile;
