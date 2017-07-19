/**
 * Simplest HOC - toggle on/off
 */
import omit from 'lodash/omit';
import React from 'react';
import PropTypes from 'prop-types';

export default function HOCtoggleable(Component, state, onToggle) {
  const klass = class extends React.Component {
    constructor(props) {
      super(props);
      this.state = state || { on: false };
      this.toggle = this.doToggle.bind(this);
      this.toggleOn = this.doToggleSet.bind(this, true);
      this.toggleOff = this.doToggleSet.bind(this, false);
      this.toggleSet = this.doToggleSet.bind(this);
    }
    componentWillReceiveProps(props) {
      this.mapPropsToState(props);
    }
    componentWillMount() {
      this.mapPropsToState(this.props);
    }
    doToggle() {
      this.doToggleSet(!this.state.on);
    }
    doToggleSet(on) {
      if (this.state.on === on) return;
      this.setState({ on });
      if (onToggle && typeof onToggle === 'function') onToggle(on);
    }
    mapPropsToState(props) {
      if (typeof props.forceExpand === 'boolean' && props.forceExpand) {
        this.toggleOn();
      }
      if (typeof props.on === 'boolean' && props.on) {
        // if we passed in an "on=true"
        //   did we also pass in toggle?
        //   if so, this is a toggle-wrapped in a toggle... so ignore
        if (typeof props.toggle !== 'function') {
          this.toggleOn();
        }
      }
      if (typeof props.defaultOn === 'boolean' && props.defaultOn) {
        this.toggleOn();
      }
    }
    render() {
      return <Component
        {...omit(this.props, 'on')}
        {...this.state}
        toggle={this.toggle}
        toggleOn={this.toggleOn}
        toggleOff={this.toggleOff}
        toggleSet={this.toggleSet}
      />;
    }
  };
  klass.displayName = `Toggleable(${Component.name})`;
  klass.propTypes = {
    on: PropTypes.bool,
    forceExpand: PropTypes.bool,
    defaultOn: PropTypes.bool,
  };
  return klass;
}

export const omitToggle = (props) => omit(
  props,
  [
    'on',
    'toggle',
    'toggleOn',
    'toggleOff',
  ],
);

