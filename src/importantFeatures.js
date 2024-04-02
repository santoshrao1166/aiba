// import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency';
import {Alert, Platform} from 'react-native';

//         week days and months array
export const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const months = [
  'Mar',
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUNE',
  'JULY',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

// export function ValidURL(str) {
//   var regex =
//     /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
//   if (!regex.test(str)) {
//     return false;
//   } else {
//     return true;
//   }
// }
export function ValidURL(userInput) {
  var res = userInput.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  if (res == null) return false;
  else return true;
}

// export function compressImage(){

// }

export const timeToAgo = ms => {
  const periods = {
    year: 12 * 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    min: 60 * 1000,
    second: 1000,
  };

  const diff = Date.now() - ms;
  // console.log(diff, ms);

  if (diff > periods.year) {
    return Math.floor(diff / periods.year) + ' year ago';
  } else if (diff > periods.month) {
    return Math.floor(diff / periods.month) + ' month ago';
  } else if (diff > periods.week) {
    return Math.floor(diff / periods.week) + ' week ago';
  } else if (diff > periods.day) {
    return Math.floor(diff / periods.day) + ' day ago';
  } else if (diff > periods.hour) {
    return Math.floor(diff / periods.hour) + ' hour ago';
  } else if (diff > periods.min) {
    return Math.floor(diff / periods.min) + ' min ago';
  } else if (diff > periods.second) {
    return Math.floor(diff / periods.second) + ' second ago';
  } else {
    return 'Just Now';
  }
};
/////////////////////////////////////////////////////////////////
//                    push notification
/////////////////////////////////////////////////////////////////
// configration using firebase push notifications

// export async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   // console.log(authStatus);
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     getfcmToken();
//   }
// }

// export const getfcmToken = async () => {
//   let token = await AsyncStorage.getItem('aibaFcmToken');

//   if (!token) {
//     try {
//       const fcmToken = await messaging().getToken();
//       if (fcmToken) {
//         console.log(fcmToken + '->new fcm tokens');
//         await AsyncStorage.setItem('aibaFcmToken', fcmToken);
//         return fcmToken;
//       }
//     } catch (error) {
//       console.log(error, 'error in fcm tokens');
//     }
//   } else {
//     console.log('old token --->', token);
//     return token;
//   }
// };

// export const notificationListner = async () => {
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log(
//       'Notification caused app to open from background state:',
//       remoteMessage.notification,
//     );
//   });

//   messaging().onMessage(async remoteMessage => {
//     console.log('recieve in open state', remoteMessage);
//   });
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log(
//           'Notification caused app to open from quit state:',
//           remoteMessage.notification,
//         );
//       }
//     });
// };
///////////////////////////////////////////////////////////////////
// configuration permission in ios for tracking users
///////////////////////////////////////////////////////////////////
export const requestForTrckingPermission = async () => {
  // console.log('inside request tracking permission function');
  if (Platform.OS != 'ios') return true;
  const trackingStatus = await requestTrackingPermission();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    // enable tracking features
    return true;
  }
  return false;
};

export const getTrackingPermissionStatus = async alertMessage => {
  // if (Platform.OS != 'ios') return true;
  const trackingStatus = await getTrackingStatus();
  console.log(trackingStatus,"trackingStatus")
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    // enable tracking features
    return true;
  }
  return false;
};
