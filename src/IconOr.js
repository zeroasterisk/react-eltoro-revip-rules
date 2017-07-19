import React from 'react';

const IconOr = ({ style, styleDefault }) => (
  <svg id='Layer_1' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'
    style={Object.assign(styleDefault, style)}
  >
    <path d='M9,18c0.672,0,1.315-0.116,1.919-0.32C9.153,16.409,8,14.342,8,12s1.153-4.409,2.919-5.68C10.315,6.116,9.672,6,9,6 c-3.309,0-6,2.691-6,6S5.691,18,9,18z' />
    <path d='M16,12c0,2.342-1.153,4.409-2.919,5.68C13.685,17.884,14.328,18,15,18c3.309,0,6-2.691,6-6s-2.691-6-6-6 c-0.672,0-1.315,0.116-1.919,0.32C14.847,7.591,16,9.658,16,12z' />
    <path d='M9,12c0,2.215,1.21,4.148,3,5.188c1.79-1.04,3-2.974,3-5.188s-1.21-4.148-3-5.188C10.21,7.852,9,9.785,9,12z' />
    <path d='M0,3v18h24V3H0z M23,20H1V4h22V20z' />
  </svg>
);
IconOr.defaultProps = {
  style: {},
  styleDefault: {
    fill: "currentcolor",
    verticalAlign: "middle",
    width: 24,
    height: 24,
  },
};
export default IconOr;
