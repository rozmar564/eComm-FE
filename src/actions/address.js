import axios from 'axios';
import { browserHistory } from 'react-router';

function getAddress() {
  return (dispatch) => {
    axios.get('/api/addresses')
      .then((resp) => {
        dispatch({ type: 'GET_ADDRESS_SUCCESS', payload: resp.data });
      })
      .catch((err) => dispatch({ type: 'GET_ADDRESS_ERROR', payload: err }));
  };
}

function addAddress(data) {
  return (dispatch) => {
    axios.post('/api/addaddress', data)
      .then((resp) => {
        if (data.address_type[0] === 'bill_address') {
          dispatch({ type: 'BILLING_ADD_SUCCESS', payload: resp.data });
        } else {
          dispatch({ type: 'SHIPPING_ADD_SUCCESS', payload: resp.data });
        }
        browserHistory.push('/my-account/dashboard');
      })
      .catch((err) => {
        if (data.address_type[0] === 'bill_address') {
          dispatch({ type: 'BILLING_ADD_ERROR', payload: err });
        } else {
          dispatch({ type: 'SHIPPING_ADD_ERROR', payload: err });
        }
      });
  };
}

export { getAddress, addAddress };