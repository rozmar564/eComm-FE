import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import HeroBanner from '../../components/HeroBanner';
import Grid from '../../components/Grid';
import homeBanner from './home_banner.jpg';

class Home extends React.Component {

  static propTypes = {
    gridItems: PropTypes.object.isRequired,
    addToCart: PropTypes.func.isRequired,
  }
  static defaultProps = {
    addToCart: () => (true),
  }
  render() {
    const heroText = {
      title: 'Now available the NEW',
      link: 'ks mannequin heads',
      url: '/ks-mannequin-heads',
    };
    const bottomText = { subtitle: 'Shop Now' };

    return (
      <section className={s.page}>
        <HeroBanner
          heroClass={'homebanner'}
          heroBanner={homeBanner}
          heroText={heroText}
          bottomText={bottomText}
        />
        <Grid
          gridClass={'productsgrid'}
          gridItems={this.props.gridItems}
          addToCart={this.props.addToCart}
        />
      </section>
    );
  }
}

export default withStyles(s)(Home);
