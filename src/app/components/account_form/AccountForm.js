import React from "react";
import Title from "../../components/text/Title";
import Subtitle from "../../components/text/Subtitle";

class AccountForm extends React.Component {
    static propTypes = {
        selected: React.PropTypes.string.isRequired,
        handleLogin: React.PropTypes.func.isRequired,
        handleUsername: React.PropTypes.func.isRequired,
        handlePassword: React.PropTypes.func.isRequired
    }

    constructor(props){
        super(props);
        this.state = {
            className: ''
        };
    }

    setFields = () => {
        var formContent = {};
        if( this.props.selected === 'login' ){
            formContent = {
                formTitle: "Login",
                formSubtitle: "Your login details",
                firstInput: "USERNAME OR EMAIL ADDRESS *",
                secondInput: "PASSWORD *",
                buttonText: "LOGIN",
                displayBottomFields: true
            };
        }else if( this.props.selected === 'register' ){
            formContent = {
                formTitle: "Register",
                formSubtitle: "Create an account",
                firstInput: "EMAIL ADDRESS *",
                secondInput: "PASSWORD *",
                buttonText: "REGISTER",
                displayBottomFields: false
            };
        }
        return formContent;
    }

    setPasswordHelpers = () => {
        if ( this.props.selected === 'login' ) {
            return (
                <div className="input-wrapper helpers-wrapper">
                    <label className="inline"
                      htmlFor="rememberme">
                        <input name="rememberme"
                          type="checkbox"
                          id="rememberme"
                          value="forever" />
                          Remember me
                    </label>
                    <p className="lost-password">
                        <a href="my-account/lost-password/">
                          Lost your password?
                        </a>
                    </p>
                </div>
            );
        }
        return null;
    }

    render(){
        const content = this.setFields();
        const passwordFields = this.setPasswordHelpers();
        return (
            <div className="account-wrapper login-wrapper">
                <Title
                  classname={'form-title'}
                  text={content.formTitle}
                />
                <Subtitle
                  classname={'form-subtitle'}
                  text={content.formSubtitle}
                />
                <form className="account-form"
                  onSubmit={this.props.handleLogin}
                >
                    <div className="input-wrapper">
                        <label className="field-names"
                          htmlFor="username">
                            {content.firstInput}
                        </label>
                        <input type="text"
                          className="input-fields"
                          name="username"
                          id="username"
                          onChange={this.props.handleUsername.bind(this)} />
                    </div>
                    <div className="input-wrapper">
                        <label className="field-names"
                          htmlFor="password">
                            {content.secondInput}
                        </label>
                        <input type="password"
                          className="input-fields"
                          name="password"
                          id="password"
                          onChange={this.props.handlePassword.bind(this)} />
                    </div>
                    <div className="input-wrapper button-wrapper">
                        <input type="submit"
                          className="account-button"
                          name="login"
                          value={content.buttonText}
                        />
                    </div>
                    {passwordFields}
                </form>
            </div>
        );
    }
}

export default AccountForm;