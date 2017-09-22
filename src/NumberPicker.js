import PropTypes from 'prop-types';
import React from 'react';
import NumberEditor from 'react-number-editor';
import connectField from 'uniforms/connectField';

const cleanInputValue = value => {
  if (!value) return 0;
  if (isNaN(parseInt(value, 10))) return 0;
  return parseInt(value, 10);
};
const NumberPicker = ({ name, value, onChange, style, className }) => {
  const last = name.slice(1 + name.lastIndexOf('.'));
  const val = cleanInputValue(value);
  if (!val) {
    return (
      <btn
        className="btn btn-sm btn-link text-muted"
        onClick={() => onChange(1)}
      >
        <em>None</em>
      </btn>
    );
  }
  return (
    <NumberEditor
      min={0}
      step={1}
      decimals={0}
      value={val}
      onValueChange={(num) => onChange(cleanInputValue(num))}
      style={style}
      className={className}
    />
  );
};
NumberPicker.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
};
NumberPicker.defaultProps = {
  className: 'form-control form-control-sm',
  style: {
    width: 80,
  },
};

export default connectField(NumberPicker);
