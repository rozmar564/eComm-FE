import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Billing.css';
// Components
import Subnav from '../../../components/Subnav';
import ContentWrapper from '../../../components/ContentWrapper';
import AddressForm from '../../../components/Forms/AddressForm';

class Billing extends React.Component {

  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    emailAddress: PropTypes.string.isRequired,
    billingAddress: PropTypes.object,
  }

  render() {
    const showEmailPhone = true;
    return (
      <section className={s.page}>
        <Subnav isLogged={this.props.loggedIn} onLogout={this.props.onLogout} />
        <ContentWrapper tabsClass={'hide'}>
          <AddressForm
            formTitle={'billing address'}
            formSubtitle={'Change your details'}
            showEmailPhone={showEmailPhone}
            buttonText={'save address'}
            selectClass={'checkoutselect'}
            emailAddress={this.props.emailAddress}
            address={this.props.billingAddress}
            onSubmit={this.props.onSubmit}
          />
        </ContentWrapper>
      </section>
    );
  }
}

export default withStyles(s)(Billing);