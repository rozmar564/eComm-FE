import React from "react";
import { connect } from "react-redux";
import { toggleLoader } from "../actions/commonActions";
import ContactForm from "../components/contact_form/ContactForm";

const mapDispatchToProps = ((dispatch) => {
    return {
        toggleLoader: (toggle) => dispatch(toggleLoader(toggle))
    };
});

class Contact extends React.Component {
    static propTypes = {
        toggleLoader: React.PropTypes.func.isRequired
    }
    // TODO - Remove the timeout - once we are connected to the API
    componentDidMount() {
        setTimeout(function(){
            this.props.toggleLoader(false);
        }.bind(this), 1000);
    }

    componentWillUnmount() {
        this.props.toggleLoader(true);
    }

    render() {
        return (
            <div className="contact-page">
                <div className="page-wrapper">
                    <div className="form-wrapper">
                        <ContactForm />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(Contact);