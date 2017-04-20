import Promise from 'bluebird';
import capitalize from 'lodash.capitalize';
import { mannequinHeadsSlugs } from '../../config';
import logger from '../logger';

/**
 * Helper function to extract the messages from
 * errors object of the response
 *
 * @param errors
 * @returns array
 */
function getErrors(errors) {
  return Object.entries(errors).map(([key, value]) => {
    // By default we return key + message
    // for example: 'firstname + can not be blank.'
    // if base error we want just the error
    const message = (key === 'base') ? `${value[0]}.` : `${key} ${value[0]}.`;
    // Return the error message
    return capitalize(message);
  });
}

/**
 * Extract errors from response
 *
 * @param data
 * @returns array of errors
 */
function extractErrors(data) {
  // failed requests should contain `error`, `errors` or `exception` keys
  // see http://guides.spreecommerce.org/api/summary.html
  const { error, errors, exception } = data;
  // if there is a single error - return
  if (error) {
    return [error];
  }
  // if there are multiple errors
  if (errors) {
    return getErrors(errors);
  }
  // Send the exception in development mode
  if (process.env.NODE_ENV !== 'production' && exception) {
    return [exception];
  }
  // Send default message when no error returned from backend
  return ['Something went wrong. Please try again later.'];
}

// Middleware function to check status codes
function checkResponse(json, status) {
  // Server Error
  if (status > 499) {
    return Promise.reject(new Error('Server Error'));
  }
  // Client Error
  if (status < 500 && status > 399) {
    return {
      status,
      isError: true,
      messages: extractErrors(json)
    };
  }
  // Success
  return json;
}

// Error response
function setError(data) {
  logger.error(data);
  const { messages, status } = data;
  const resp = {
    isError: true,
    messages: messages || ['Error.'],
    status: status || 500
  };
  return resp;
}

// Session params
/* eslint-disable no-param-reassign */
function setUserSession(token, request) {
  request.session.user_token = token;
  request.session.guest_token = null;
  request.session.order = null;
  return true;
}

// Clear session params
function clearSession(request) {
  request.session.destroy((err) => {
    console.error(err);
  });
  return true;
}
/* eslint-enable no-param-reassign */

// Modify address response
function setAddressResponse(data) {
  let resp;
  if (data && data.id) {
    resp = {
      isLoaded: true,
      isEmpty: false,
      address: data
    };
  } else {
    resp = {
      isLoaded: true,
      isEmpty: true,
      address: {}
    };
  }
  return resp;
}

// Modidify login/register response
function setAuthResponse(data, request) {
  let resp;
  if (!data.isError && data.user) {
    const user = {
      loggedIn: true,
      profile: {
        isLoaded: false,
        email: '',
        f_name: '',
        l_name: ''
      }
    };
    const token = data.user.spree_api_key;
    setUserSession(token, request);
    resp = {
      isError: false,
      user,
      billing: setAddressResponse(data.bill_address),
      shipping: setAddressResponse(data.ship_address)
    };
  } else {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  return resp;
}

// Set Logout response
function setLogoutResponse(request) {
  clearSession(request);
  const resp = {
    isError: false,
    user: {
      loggedIn: false,
      profile: {
        isLoaded: true,
        email: '',
        f_name: '',
        l_name: ''
      }
    }
  };
  return resp;
}

// Set Login Check response
function setUserResponse(request) {
  return new Promise((resolve, reject) => {
    try {
      let resp;
      if (request.session.user_token) {
        resp = {
          isError: false,
          user: {
            loggedIn: true,
            profile: {
              isLoaded: false,
              email: '',
              f_name: '',
              l_name: ''
            }
          }
        };
      } else {
        resp = {
          isError: false,
          user: {
            loggedIn: false,
            profile: {
              isLoaded: true,
              email: '',
              f_name: '',
              l_name: ''
            }
          }
        };
      }
      resolve(resp);
    } catch (err) {
      reject(err);
    }
  });
}

function setDefaultAddresses(addresses, billing, shipping) {
  const billingId = billing ? billing.id : 0;
  const shippingId = shipping ? shipping.id : 0;
  addresses.forEach((address) => {
    address.isBilling = address.id === billingId; // eslint-disable-line no-param-reassign
    address.isShipping = address.id === shippingId; // eslint-disable-line no-param-reassign
  });
  return addresses;
}

// Format User Addresses Response
function setAddressesResponse(data, newAddress) {
  let resp;
  if (!data.isError) {
    resp = {
      isError: false,
      billing: setAddressResponse(data.bill_address),
      shipping: setAddressResponse(data.ship_address),
      addresses: {
        isLoaded: true,
        isEmpty: data.owner_address.length === 0,
        addresses: setDefaultAddresses(data.owner_address, data.bill_address, data.ship_address)
      }
    };
    if (newAddress && newAddress.isNew && newAddress.address) {
      resp.newAddress = newAddress.address;
    }
  } else {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status,
      billing: {
        isLoaded: true,
        isEmpty: true,
        address: {}
      },
      shipping: {
        isLoaded: true,
        isEmpty: true,
        address: {}
      },
      addresses: {
        isLoaded: true,
        isEmpty: true,
        addresses: []
      }
    };
  }
  return resp;
}

// Format edit/create address response
function setEditCreateAddressResponse(data) {
  let resp;
  if (!data.isError && !data.errors) {
    resp = {
      billing: setAddressResponse(data.default_addresses.bill_address),
      shipping: setAddressResponse(data.default_addresses.ship_address)
    };
  } else {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  return resp;
}

function setCreateAddressResponse(data, request, callback) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
    return resp;
  }
  return callback(request, { isNew: true, address: data.address });
}

function setEditAddressResponse(data, request, callback) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
    return resp;
  }
  return callback(request, { address: data.address });
}

// Format Order Response
function setOrderResponse(data) {
  let resp;
  if (!data.isError) {
    resp = {
      isError: false,
      isEmpty: (Object.getOwnPropertyNames(data).length < 1),
      order: data
    };
  } else {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status,
      order: {}
    };
  }
  return resp;
}

// Format User Orders Response
function setOrdersResponse(data) {
  let resp;
  if (!data.isError) {
    resp = {
      isLoaded: true,
      isError: false,
      isEmpty: data.orders.length === 0,
      orders: data.orders
    };
  } else {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status,
      orders: []
    };
  }
  return resp;
}

function setCartResponse(data) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status,
      cart: {}
    };
  } else {
    const isEmpty = data.total_quantity < 1;
    resp = { isEmpty, cart: data };
  }
  return resp;
}

function setAddRemoveCartResponse(data) {
  let resp;
  if (data.item.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  } else {
    resp = {
      isError: false,
      name: data.item.name || data.item.variant.name,
      cart: data.cart
    };
  }
  return resp;
}

function setCouponResponse(data) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  } else {
    resp = {
      isError: false,
      data
    };
  }
  return resp;
}

/* PRODUCTS */

/* Set Product Response */
function setProductResponse(data) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  } else {
    resp = {
      isError: false,
      isEmpty: (Object.getOwnPropertyNames(data).length < 1),
      product: data
    };
  }
  return resp;
}

/* Set Products Response */
function setProductsResponse(data) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  } else {
    resp = {
      isError: false,
      isEmpty: data.products.length === 0,
      products: data.products
    };
  }
  return resp;
}

/* Set Recommendations Response */
function setRecsResponse(data) {
  let resp;

  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status,
      isLoaded: true,
      isEmpty: true,
      products: []
    };
  } else {
    resp = {
      isError: false,
      isLoaded: true,
      isEmpty: data.relations.length < 1,
      products: data.relations.slice(0, 3).map((rel) => (rel.product))
    };
  }
  return resp;
}

function setMannequinHeadsResponse(data) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  } else {
    const products = data.products
      .filter((product) => (mannequinHeadsSlugs.includes(product.slug)));
    resp = {
      isError: false,
      isEmpty: products.length < 1,
      products
    };
  }
  return resp;
}

/* CONTACT */
function setContactResponse(data) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  } else {
    resp = {
      isError: false,
      messages: ['Thank you. Your message has been submited.']
    };
  }
  return resp;
}

/* CHECKOUT */

function setBraintreeResponse(data) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      isEmpty: true,
      messages: messages || ['Error.'],
      status
    };
  } else {
    resp = {
      isError: false,
      isEmpty: (Object.getOwnPropertyNames(data).length < 1),
      tokens: data
    };
  }
  return resp;
}

function setAddressCallBack(request, data, isPayPal, callback) {
  let resp;
  if (data.isError) {
    const { messages, status } = data;
    resp = {
      isError: true,
      isEmpty: true,
      messages: messages || ['Error.'],
      status
    };
    return resp;
  }
  if (isPayPal) {
    return setCartResponse(data, request, () => (true));
  }
  return callback(request);
}

/* Parse profile */
function parseProfile(data) {
  if (data.isError) {
    const { messages, status } = data;
    return {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  let resp = { isLoaded: true, profile: {} };
  if (Object.getOwnPropertyNames(data).length > 0) {
    resp = { isLoaded: true, profile: data.users[0] };
    return resp;
  }
  return resp;
}

/* Parse profile on Update */
function parseProfileUpdate(data) {
  if (data.isError) {
    const { messages, status } = data;
    return {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  let resp = { isLoaded: true, profile: {} };
  if (data) {
    resp = { isLoaded: true, profile: data };
    return resp;
  }
  return resp;
}

/* Parse password Update */
function parsePasswordUpdate(data) {
  if (data.isError) {
    const { messages, status } = data;
    return {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  return {
    isError: false,
    messages: [],
    status: 200
  };
}

/* Delete Address */
function setDeleteAddressResponse(data) {
  if (data.isError) {
    const { messages, status } = data;
    return {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  return {
    isError: false,
    messages: [],
    status: 200
  };
}

/* Reset password - parse the response from send reset email step */
function parseResetResponse(data) {
  if (data.isError) {
    const { messages, status } = data;
    return {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  if (data.errors) {
    return {
      isError: true,
      messages: data.errors,
      status: 422
    };
  }
  let resp = {};
  if (data) {
    resp = `${data.message} to ${data.user.email}`;
  }
  return resp;
}

function parseNewPasswordResponse(data) {
  if (data.isError) {
    const { messages, status } = data;
    return {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  return {
    isError: false,
    data: data.message
  };
}

function parseGiftRedeemResponse(data) {
  if (data.isError) {
    const { messages, status } = data;
    return {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  return {
    isError: false,
    data: 'Gift card redeemed'
  };
}

function parseStoreCredit(data) {
  if (data.isError) {
    const { messages, status } = data;
    return {
      isError: true,
      messages: messages || ['Error.'],
      status
    };
  }
  if (data.count > 0) {
    return {
      isLoaded: true,
      totalAmount: data.store_credit_events[0].display_user_total_amount
    };
  }
  return {
    isLoaded: true,
    totalAmount: 0
  };
}

export {
  checkResponse,
  setError,
  setAuthResponse,
  setLogoutResponse,
  setUserResponse,
  setAddressResponse,
  setAddressesResponse,
  setCreateAddressResponse,
  setEditAddressResponse,
  setEditCreateAddressResponse,
  setOrderResponse,
  setOrdersResponse,
  setCartResponse,
  setAddRemoveCartResponse,
  setCouponResponse,
  setProductResponse,
  setProductsResponse,
  setRecsResponse,
  setMannequinHeadsResponse,
  setContactResponse,
  setBraintreeResponse,
  setAddressCallBack,
  parseProfile,
  parseProfileUpdate,
  parsePasswordUpdate,
  setDeleteAddressResponse,
  parseResetResponse,
  parseNewPasswordResponse,
  parseGiftRedeemResponse,
  parseStoreCredit
};
