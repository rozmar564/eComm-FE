import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import NotFound from './NotFound';
// Actions
import { setHeaderProps, resetMessages, toggleLoader } from '../../actions/page';

const mapDispatchToProps = ((dispatch) => (
  {
    setHeaderProps: (props) => dispatch(setHeaderProps(props)),
    toggleLoader: (toggle) => dispatch(toggleLoader(toggle)),
    resetMessages: () => dispatch(resetMessages()),
  }
));
class NotFoundWrapper extends React.Component {

  static propTypes = {
    setHeaderProps: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
  }

  componentWillMount = () => {
    const props = {
      headerClass: 'colored',
      activeSlug: '/',
    };
    this.props.setHeaderProps(props);
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.props.toggleLoader(false);
    }, 500);
  }

  componentWillUnmount = () => {
    console.log('remove');
    this.props.toggleLoader(true);
  }

  render() {
    console.log('client');
    return (
      <NotFound />
    );
  }
}

export default connect(null, mapDispatchToProps)(NotFoundWrapper);
