import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderRow.css';

class OrderRow extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
  }

  render() {
    const order = this.props.order;
    const orderLink = `/my-account/view-order/${order.id}`;
    return (
      <tr className={s.order}>
        <td className={s.ordernumber}>
          <a
            href={orderLink}
            className={s.orderlink}
          >
            #{order.id}
          </a>
        </td>
        <td className={s.orderdate}>
          {order.created_at.substring(0, 10)}
        </td>
        <td className={s.orderstatus}>
          Processing
        </td>
        <td className={s.ordertotal}>
          <span className={s.amount}> {order.display_total} </span>
          for {order.line_items.length} items
        </td>
        <td className={s.viewlinkwrpr}>
          <a
            href={orderLink}
            className={s.viewlink}
          >
            View
          </a>
        </td>
      </tr>
    );
  }
}

export default withStyles(s)(OrderRow);