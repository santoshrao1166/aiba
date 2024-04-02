import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {axiosGet, axiosPost} from '../axios';
import {Toumbnail} from '../components/Card';
import Header from '../components/Header';
import {serverEndPoint} from '../config';

const {height, width} = Dimensions.get('window');

function VendorLiveDetails({navigation, route}) {
  const {vendorId} = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [vendorData, setvendorData] = useState({});
  const [curLive, setcurLive] = useState([]);
  const [preLive, setpreLive] = useState([]);
  const [pageNum, setpageNum] = useState(0);

  useEffect(() => {
    axiosGet(
      'user/vendor_profile?vendor_id=' + vendorId,
      data => {
        setcurLive(data?.current_lives);
        setvendorData(data?.vendor_data);
      },
      null,
      navigation,
      dispatch,
    );

    return () => {
      setcurLive([]);
      setvendorData({});
    };
  }, [vendorId]);
  useEffect(() => {
    axiosGet(
      `user/vendor_previous_lives?vendor_id=${vendorId}&start=${pageNum}`,
      data => {
        setpreLive(pre => {
          // console.log(pre);
          pre = [...pre, ...data];
          console.log(pre);
          return pre;
        });
        // console.log(data);
      },
      null,
      navigation,
      dispatch,
    );

    return () => {
      // setpreLive([]);
    };
  }, [vendorId, pageNum]);

  useEffect(() => {
    let data = new FormData();
    data.append('type', 'profile');
    data.append('vendor_id', vendorId);
    axiosPost(
      `user/add_stat`,
      data,
      data => {},
      null,
      null,
      navigation,
      dispatch,
    );
  }, [vendorId]);
  return (
    <ScrollView style={{backgroundColor: '#F2F2F2'}}>
      {/* back and hambuger */}
      <Header isAuth navigation={navigation} />

      {/* remaining body is in this view  */}
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {/* <Text style={{fontSize: 30, fontWeight: '700'}}> Vendor Lives </Text> */}

        {/* profile pic and edit btn */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            marginTop: 20,
          }}>
          <Image
            resizeMode="contain"
            style={{width: 90, height: 90}}
            source={{
              uri: vendorData?.profile_image
                ? serverEndPoint + 'uploads/docs/' + vendorData?.profile_image
                : 'https://ui-avatars.com/api/?name=' + vendorData?.name,
            }}
          />
        </View>
        <Text style={styles.userName}>{vendorData?.name}</Text>
        {/* <Text style={styles.userOtherData}>{vendorData?.current_address}</Text> */}

        <View>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${vendorData?.calling_no}`)}>
            <Text style={styles.userOtherData}>
              Phone Number :{' '}
              <Text style={{color: 'blue'}}> {vendorData?.calling_no}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`https://wa.me/+91${vendorData?.whatsapp_no}`)
            }>
            <Text style={styles.userOtherData}>
              Whatsapp Number :{' '}
              <Text style={{color: 'blue'}}>{vendorData?.whatsapp_no}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              if (vendorData?.insta_link)
                try {
                  await Linking.openURL(vendorData?.insta_link);
                } catch (error) {
                  console.log(error);
                }
            }}>
            {vendorData?.insta_link ? (
              <Text numberOfLines={1}>
                instagram Link :
                <Text style={{color: 'blue'}}>
                  {' ' + vendorData?.insta_link}
                </Text>
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={styles.hr}></View>
        {/* below card and diffrent data  */}
      </View>

      <View style={styles.card}>
        <Text style={styles.liveTitle}>Current Livestreams</Text>

        <View style={styles.liveContainer}>
          {curLive?.length ? (
            curLive?.map((live, i) => (
              <TouchableOpacity
                key={`currlive${i}`}
                style={{marginBottom: 20}}
                onPress={() => {
                  if (live?.live_link)
                    navigation.navigate('Live', {
                      liveLink: live?.live_link,
                      vendorId: live?.user_id,
                    });
                  else {
                    // Alert.alert('Heya', 'No live link added yet.');
                    return;
                  }
                }}>
                <Toumbnail live={live} />
              </TouchableOpacity>
            ))
          ) : (
            <>
              <Text style={styles.noDataMessage}>No current lives</Text>
            </>
          )}
        </View>

        <Text style={styles.liveTitle}>Previous Lives</Text>
        <View style={styles.hr}></View>

        <View style={styles.liveContainer}>
          {preLive?.length ? (
            preLive?.map((live, i) => (
              <TouchableOpacity
                key={`prelive${i}`}
                style={{marginVertical: 10}}
                onPress={() => {
                  if (live?.live_link)
                    navigation.navigate('Live', {
                      liveLink: live?.live_link,
                      vendorId: live?.user_id,
                    });
                  else {
                    // Alert.alert('Heya', 'No live link added yet.');
                    return;
                  }
                }}>
                <Toumbnail live={live} previous />
              </TouchableOpacity>
            ))
          ) : (
            <>
              <Text style={styles.noDataMessage}>No previous lives</Text>
            </>
          )}
          {preLive.length >= 6 * (pageNum + 1) ? (
            <TouchableOpacity
              style={{
                padding: 10,
                marginTop: 20,
                backgroundColor: 'orange',
                borderRadius: 10,
              }}
              onPress={() => setpageNum(pre => pre + 1)}>
              <Text style={{color: 'white'}}>Load More</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hr: {
    borderColor: 'black',
    borderWidth: 0.5,
    width: '100%',
    marginVertical: 10,
  },

  liveContainer: {
    marginHorizontal: width * 0.05,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  userName: {fontSize: 18, marginVertical: 8},
  userOtherData: {marginVertical: 5},
  noDataMessage: {
    textAlign: 'center',
    fontSize: 18,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  liveTitle: {
    marginLeft: width * 0.05,
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 15,
  },
  card: {
    backgroundColor: 'white',
    width: width * 0.94,
    marginLeft: width * 0.03,
    marginTop: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: 'black',
    opacity: 0.5,
    flex: 1,
  },
});
export default VendorLiveDetails;
