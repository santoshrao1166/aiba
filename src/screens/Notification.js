import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  FlatList,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from '../axios';
import {timeToAgo} from '../importantFeatures';

const {height, width} = Dimensions.get('window');

function Notification({navigation}) {
  const [notifications, setnotifications] = useState([]);

  //get all upcomming notification of user
  const getNotification = async () => {
    try {
      let notification = await axios.get('user/notifications');
      notification = await notification.data;
      notification = notification.data; // get obj {status : 1 , data :  {upcoming_notification: [,…], past_notification: []}}
      // console.log(notification);
      setnotifications(notification);
      // console.log(notification);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNotification();
  }, []);

  useEffect(() => {
    const reload = navigation.addListener('focus', getNotification);
    return reload;
  }, [navigation]);
  return (
    <View style={{backgroundColor: '#F2F2F2', height: height}}>
      {/* <StatusBar backgroundColor="#F2F2F2" /> */}
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
          width: width,
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            // marginBottom: 25,
          }}>
          Notifications
        </Text>

        {/* all notification are here */}
        <View style={{marginTop: 18}}>
          {notifications?.length ? (
            <SafeAreaView>
              <FlatList
                data={notifications}
                renderItem={(notification, i) => (
                  <NotificationDetails
                    key={i}
                    getnotification={getNotification}
                    notification={notification.item}
                  />
                )}
              />
            </SafeAreaView>
          ) : (
            <Text style={{fontSize: 20, marginTop: 40, textAlign: 'center'}}>
              No notifications
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default Notification;

const NotificationDetails = ({getnotification, notification}) => {
  const [timeAgo, settimeAgo] = useState(0); //To show time ago
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  useEffect(() => {
    // console.log(notification?.added_on);
    if (notification?.added_on) {
      let d = notification?.added_on;
      d = d?.split(' ');
      let time = d[1]?.split(':');

      d = new Date(d[0])?.getTime();
      let xyz = time[0] * 60 * 60 * 1000 + time[1] * 60 * 1000 + time[2] * 1000;

      settimeAgo(d + xyz);
    }
  }, [notification?.added_on]);

  return (
    <>
      <View
        style={{
          borderBottomColor: '#C4C4C4',
          borderBottomWidth: 0.5,
          width: width,
          paddingHorizontal: width * 0.05,
          paddingVertical: 10,
          backgroundColor: '#ffffff',
        }}>
        <Text style={{fontWeight: '700', marginLeft: 4}}>
          {notification?.title}
        </Text>
        {/* <Text numberOfLines={2}>{notification.body}</Text> */}
        <Text
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 2}
          style={{lineHeight: 21}}>
          {notification?.body}
        </Text>

        {lengthMore ? (
          <TouchableOpacity onPress={() => {}}>
            <Text
              onPress={toggleNumberOfLines}
              style={{lineHeight: 21, marginTop: 10}}>
              {textShown ? 'Read less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        ) : null}
        <Text
          style={{
            fontSize: 12,
            color: 'rgba(0,0,0,0.5)',
            marginVertical: 10,
          }}>
          {timeToAgo(timeAgo)}
        </Text>
      </View>
    </>
  );
};
