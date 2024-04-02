import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Alert} from 'react-native';
import {serverEndPoint} from './config';
import {logout} from './redux/action/auth';

let instance = axios.create({
  baseURL: serverEndPoint,
});

function invalid_user_handler(navigation, dispatch) {
  Alert.alert('Error!', 'Please login first.');
  try {
    AsyncStorage.removeItem('aibaUser');
    AsyncStorage.removeItem('aibaPass');
    dispatch(logout());
    navigation.navigate('Login');
  } catch (error) {
    dispatch(logout());
  }
}

function err_handler(error_msg, url) {
  console.log(error_msg, url, '==>axios24');
  Alert.alert('Error!', error_msg);
}

function unknown_err_handler() {
  Alert.alert('Error!', 'Something went wrong, Please try again.');
}

function success_handler({message}) {
  Alert.alert('Success', message);
}

function form_validation_handler(response) {
  Alert.alert('Please check', JSON.stringify(response?.validation_errors));
}
function axiosPost(
  url,
  form,
  cb_success,
  cb_error,
  cb_form_validator,
  navigation,
  dispatch,
) {
  instance
    .post(url, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => res.data)
    .then(response => {
      // console.log(response);
      // $('.full_loader').hide();
      switch (response.status) {
        case 0: {
          if (cb_error) cb_error(response);
          else err_handler(response?.error, url);

          break;
        }

        case 1: {
          if (cb_success) {
            cb_success(response?.data ? response?.data : response);
          } else success_handler(response);
          break;
        }

        case -1: {
          invalid_user_handler(navigation, dispatch);

          break;
        }

        case -2: {
          if (cb_form_validator) cb_form_validator(response);
          else form_validation_handler(response);

          break;
        }

        default:
          unknown_err_handler(response);
      }
    })

    .catch(err => {
      console.log(err);
      err_handler(err, url + 'catch ');
    });
}

function axiosGet(url, cb_success, cb_error, navigation, dispatch) {
  // fetch(HOST + url)
  instance
    .get(url)
    .then(res => res.data)
    .then(response => {
      switch (response.status) {
        case 0: {
          if (cb_error) cb_error(response?.error);
          else err_handler(response?.error, url);
          break;
        }

        case 1: {
          if (cb_success) cb_success(response.data?response.data:response);
          else success_handler(response?.message);

          break;
        }

        case -1: {
          invalid_user_handler(navigation, dispatch);

          break;
        }

        case -2: {
          form_validation_handler(response?.validation_errors);

          break;
        }

        default:
          unknown_err_handler(response);
      }
    })

    .catch(err => {
      console.log(err);

      if (cb_error) cb_error(err);
      else err_handler(err, url + 'catch');
    });
}
function axiosCustomGet(url, cb_success, cb_error, navigation, dispatch) {
  // fetch(HOST + url)
  instance
    .get(url)
    .then(res => res.data)
    .then(response => {
      console.log("status",response)
      switch (response.status) {
        case 0: {
          if (cb_error) cb_error(response?.error);
          else err_handler(response?.error, url);
          break;
        }

        case 1: {
          if (cb_success) cb_success(response);
          else success_handler(response?.message);

          break;
        }

        case -1: {
          invalid_user_handler(navigation, dispatch);

          break;
        }

        case -2: {
          form_validation_handler(response?.validation_errors);

          break;
        }

        default:
          unknown_err_handler(response);
      }
    })

    .catch(err => {
      console.log(err);

      if (cb_error) cb_error(err);
      else err_handler(err, url + 'catch');
    });
}
export {axiosGet, axiosPost, axiosCustomGet};
export default instance;
