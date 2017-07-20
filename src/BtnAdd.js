import isArray from 'lodash/isArray';
import PropTypes from 'prop-types';
import React from 'react';

const BtnAdd = ({ showAnd, showOr, value, onChange }) => (isArray(value) && (
  <div className="btn-group btn-group-sm">
    <btn
      className="btn btn-secondary"
      onClick={() => {
        console.log('add term', value);
        onChange(value.concat([{ term: '', use: 'term' }]))}}
    >
      <i className="fa fa-plus fa-fw text-default" />{' '}
      Add Term/URL
    </btn>
    {showOr && (
      <btn
        className="btn btn-secondary"
        onClick={() => onChange(value.concat([{ or: [] }]))}
      >
        <i className="fa fa-plus fa-fw text-info" />{' '}
        Add Nested Optional Set (match any one in set)
      </btn>
    )}
    {showAnd && (
      <btn
        className="btn btn-secondary"
        onClick={() => onChange(value.concat([{ and: [] }]))}
      >
        <i className="fa fa-plus fa-fw text-primary" />{' '}
        Add Nested Required Set (match everyone in set)
      </btn>
    )}
  </div>
));
BtnAdd.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
  showAnd: PropTypes.bool,
  showOr: PropTypes.bool,
};
BtnAdd.defaultProps = {
  value: [],
  showAnd: true,
  showOr: true,
};
export default BtnAdd;
