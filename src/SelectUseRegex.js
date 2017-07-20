import PropTypes from 'prop-types';
import React from 'react';
import connectField from 'uniforms/connectField';

const SelectUseRegex = ({ value, onChange }) => (
  value === true ? (
    <label className="col-form-label">
      <i className="fa fa-fw fa-search" />
      Regex
      <btn
        className="btn btn-link btn-sm py-0 mt-0 mb-1"
        style={{ opacity: 0.6 }}
        onClick={() => onChange(false)}
      >
        <i className="fa fa-fw fa-link" />
      </btn>
    </label>
  ) : (
    <label className="col-form-label">
      <i className="fa fa-fw fa-link" />
      Term/URL
      <btn
        className="btn btn-link btn-sm py-0 mt-0 mb-1"
        style={{ opacity: 0.5 }}
        onClick={() => onChange(true)}
      >
        <i className="fa fa-fw fa-search" />
      </btn>
    </label>
  )
);

export default connectField(SelectUseRegex);
