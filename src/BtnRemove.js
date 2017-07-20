/**
 * TODO split this into a HOC and a UI component
 * at which point, the block could dim, when waiting on confirmation for a better UI
 */
import PropTypes from 'prop-types';
import React from 'react';

export default class BtnRemove extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }
  activate = () => this.setState({ active: true })
  cancel = () => this.setState({ active: false })
  trash = () => {
    // remove this node from path
    const { findValue, onChange, name } = this.props;
    const parentName = name.slice(0, name.lastIndexOf('.'));
    const value = findValue(parentName);
    const fieldIndex = +name.slice(1 + name.lastIndexOf('.'));
    onChange([]
      .concat(value.slice(0,  fieldIndex))
      .concat(value.slice(1 + fieldIndex)),
      parentName
    );
  }
  render() {
    const { value } = this.props;
    const { active } = this.state;
    return (
      <div className="btn-group btn-group-sm">
        {active && (
          <button onClick={this.trash} className="btn btn-danger">
            <i className="fa fa-trash" /> Remove {value && value.map && 'Set'}
          </button>
        )}
        {active && (
          <button onClick={this.cancel} className="btn btn-secondary">
            <i className="fa fa-remove" /> Cancel
          </button>
        )}
        {!active && (
          <button onClick={this.activate} className="btn btn-link text-muted">
            <i className="fa fa-remove" />
          </button>
        )}
      </div>
    );
  }
}
BtnRemove.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};
BtnRemove.defaultProps = {
};
