import {authReducer} from './authReducer';
import {theme} from './theme';
import {combineReducers} from 'redux';

export const allReducer = combineReducers({
  user: authReducer,
  theme: theme,
});
