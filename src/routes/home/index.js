import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';
import Layout from '../../components/Layout';

export default {

  path: '/',

  async action() {
    const cart = await fetch('/api/cart')
      .then((resp) => (resp.json())
        .then((json) => (json)));
    return {
      title: 'React Starter Kit',
      component: <Layout headerClass={'default'} activeSlug={'/'} cartItems={cart}><Home /></Layout>,
    };
  },

};
