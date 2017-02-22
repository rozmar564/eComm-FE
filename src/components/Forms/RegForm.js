import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Forms.css';
import { testPasswordStrength } from '../../helpers/validators';

class RegForm extends React.Component {

  static propTypes = {
    onRegister: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      validInputs: true,
      messageClass: 'hide',
      disabled: false
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const data = this.state;
    if (this.state.validInputs) {
      this.props.onRegister(data);
    }
  };

  onEmailChange = (event) => {
    this.setState({
      email: event.target.value
    });
  };

  onPassChange = (event) => {
    this.setState({
      password: event.target.value
    });
    const valid = testPasswordStrength(this.state.password);
    if (valid.isError) {
      this.setState({
        validInputs: false,
        messageClass: 'show',
        disabled: true
      });
    } else {
      this.setState({
        validInputs: true,
        messageClass: 'hide',
        disabled: false
      });
    }
  };

  render() {
    return (
      <div className={s.formcontent}>
        <h1 className={s.title}>Register</h1>
        <h2 className={s.subtitle}>Create an account</h2>
        <form className={cx(s.form, s.register)} onSubmit={this.onSubmit}>
          <div className={s.inputwrapper}>
            <label className={s.label} htmlFor="email">Email Address <abbr>*</abbr></label>
            <input id="email" type="email" name="email" className={s.input} onChange={this.onEmailChange} />
          </div>
          <div className={s.inputwrapper}>
            <label className={s.label} htmlFor="password">Password <abbr>*</abbr></label>
            <input id="password" type="password" name="password" className={s.input} onChange={this.onPassChange} />
          </div>
          <div className={s[this.state.messageClass]}>
            <div className={s.passworderror}>
              Weak - Please enter a stronger password.
            </div>
            <div className={s.passwordhint}>
              The password should be at least eight characters long.
            </div>
          </div>
          <div className={s.buttonwrapper}>
            <input
              className={s.submit}
              type="submit"
              value="Register"
              disabled={this.state.disabled}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default withStyles(s)(RegForm);
