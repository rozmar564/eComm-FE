import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from '../Forms/Forms.css';

const { SqPaymentForm } = global;

class SquarePayment extends Component {

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onNonceReceived: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      is_processing: false, // for disabling payment button
      card_errors: []
    };
  }

  componentDidMount = () => {
    this.paymentForm = new SqPaymentForm({
      applicationId: 'sandbox-sq0idp-zZJC4qFxIk0LYgwAKygtWQ',
      inputClass: 'sq-input',
      inputStyles: [
        {
          fontSize: '12px',
          lineHeight: '42px',
          padding: '0 12px',
          backgroundColor: 'transparent'
        }
      ],
      cardNumber: {
        elementId: 'sq-card-number',
        placeholder: '0000 0000 0000 0000'
      },
      cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
      },
      expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
      },
      postalCode: {
        elementId: 'sq-postal-code',
        placeholder: '10001'
      },
      callbacks: {
        cardNonceResponseReceived: (errors, nonce, cardData) => {
          if (errors) {
            this.setState({
              is_processing: false,
              card_errors: errors
            });
          } else {
            this.setState({
              is_processing: false,
              card_errors: []
            });
            const data = {
              nonce,
              cardData
            };
            this.props.onNonceReceived(data);
          }
        }
      }
    });
    this.paymentForm.build();
  };

  handleSubmit = () => {
    this.setState({
      is_processing: true
    });
    this.paymentForm.requestCardNonce();
  };

  render() {
    return (
      <div className={s.squaremodal}>
        <div id="card-errors">{this.state.card_errors}</div>
        <div className={s.formwrapper}>
          <h1 className={s.title}>Payment</h1>
          <h2 className={s.subtitle}>Please enter your details</h2>
          <div className={s.inputwrapper}>
            <label htmlFor="sq-card-number" className={s.label}>Card Number</label>
            <input id="sq-card-number" className={s.input} onChange={this.handleCardNbChange} />
          </div>
          <div className={s.inputwrapper}>
            <label htmlFor="sq-cvv" className={s.label}>CVV</label>
            <input id="sq-cvv" className={s.input} onChange={this.handleCvvChange} />
          </div>
          <div className={s.inputwrapper}>
            <label htmlFor="sq-expiration-date" className={s.label}>Expiration Date</label>
            <input id="sq-expiration-date" className={s.input} onChange={this.handleExpirationChange} />
          </div>
          <div className={s.inputwrapper}>
            <label htmlFor="sq-postal-code" className={s.label}>Postal Code</label>
            <input id="sq-postal-code" className={s.input} onChange={this.handlePCodeChange} />
          </div>
          <div className={cx(s.buttonwrapper, s.buttonwrapper3)}>
            <input
              type="submit"
              id="submit"
              value="Set Payment"
              className={s.submit}
              onClick={this.handleSubmit}
              disabled={this.state.is_processing}
            />
            <input
              type="button"
              value="Cancel"
              className={cx(s.submit, s.cancel)}
              onClick={this.props.onCancel}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SquarePayment);