import axios from 'axios';
import { browserHistory } from 'react-router';

function checkLogin() {
  return (dispatch) => {
    axios.get('/api/check')
      .then((resp) => dispatch({ type: 'GET_USER_SUCCESS', payload: resp.data }))
      .catch((err) => dispatch({ type: 'GET_USER_ERROR', payload: err }));
  };
}

function onLogout() {
  return (dispatch) => {
    axios.post('/api/logout', {})
      .then((resp) => {
        axios.get('/api/cart')
          .then((cart) => dispatch({ type: 'GET_CART_SUCCESS', payload: cart.data }))
          .catch((err) => dispatch({ type: 'GET_CART_ERROR', payload: err }));
        dispatch({ type: 'LOGOUT_SUCCESS', payload: resp });
        browserHistory.push('/my-account');
        dispatch({ type: 'SET_MESSAGE', payload: { isError: false, message: '' } });
      })
      .catch((err) => dispatch({ type: 'LOGOUT_ERROR', payload: err }));
  };
}

function onLogin(data) {
  return (dispatch) => {
    axios.post('/api/login', data)
      .then((resp) => {
        if (resp.data.error) {
          dispatch({ type: 'SET_MESSAGE', payload: { isError: true, message: resp.data.message } });
        } else {
          axios.get('/api/cart')
            .then((cart) => dispatch({ type: 'GET_CART_SUCCESS', payload: cart.data }))
            .catch((err) => dispatch({ type: 'GET_CART_ERROR', payload: err }));
          dispatch({ type: 'LOGIN_SUCCESS', payload: resp.data });
          browserHistory.push('/my-account/dashboard');
          dispatch({ type: 'SET_MESSAGE', payload: { isError: false, message: 'Login Success' } });
        }
      })
      .catch((err) => dispatch({ type: 'LOGIN_ERROR', payload: err }));
  };
}

function onRegister(data) {
  return (dispatch) => {
    axios.post('/api/register', data)
      .then((resp) => {
        axios.get('/api/cart')
          .then((cart) => dispatch({ type: 'GET_CART_SUCCESS', payload: cart.data }))
          .catch((err) => dispatch({ type: 'GET_CART_ERROR', payload: err }));
        dispatch({ type: 'REGISTRATION_SUCCESS', payload: resp.data });
        browserHistory.push('/my-account/dashboard');
      })
      .catch((err) => dispatch({ type: 'REGISTRATION_ERROR', payload: err }));
  };
}

export { onLogout, onLogin, onRegister, checkLogin };