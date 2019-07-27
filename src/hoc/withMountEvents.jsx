import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

export default options => Component => {
  class Wrapper extends React.PureComponent {
    componentDidMount() {
      this.props.onMount();
    }

    componentWillUnmount() {
      this.props.onUnmount();
    }

    render() {
      const { onMount, onUnmount, ...rest } = this.props;
      return <Component {...options} {...rest} />;
    }
  }

  Wrapper.propTypes = {
    onMount: PropTypes.func,
    onUnmount: PropTypes.func
  };

  Wrapper.defaultProps = {
    onMount: noop,
    onUnmount: noop
  };

  return Wrapper;
};
