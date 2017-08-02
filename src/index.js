import classnames from 'classnames';
import isArray from 'lodash/isArray';
import PropTypes from 'prop-types';
import React, {Children} from 'react';
import connectField from 'uniforms/connectField';
import joinName     from 'uniforms/joinName';
import NestField from 'uniforms-bootstrap4/NestField';
import AutoField from 'uniforms-bootstrap4/AutoField';
import TextField from 'uniforms-bootstrap4/TextField';
import NumField from 'uniforms-bootstrap4/NumField';

import HOCToggleable from './HOCToggleable';
import SelectUseRegex from './SelectUseRegex';
import NumberPicker from './NumberPicker';
import BtnAdd from './BtnAdd';
import BtnRemove from './BtnRemove';

import IconAnd from './IconAnd';
import IconOr from './IconOr';

const CardControl = ({ on, toggle }) => (
  <btn className="btn btn-sm btn-link" onClick={toggle}>
    <i className={classnames('fa fa-fw', { 'fa-caret-up': on, 'fa-caret-down': !on })} />
  </btn>
);
const Empty = ({ children }) => <em className="text-muted" style={{ opacity: 0.6 }}>{children}</em>;

const OrTitle = ({ small }) => (
  small ? (
    <div className="text-muted">
      <IconOr style={{ height: 18, width: 18, marginBottom: 4 }}  className="text-success" />
      {' '}
      <em>Match <strong>Any One</strong></em>
    </div>
  ) : (
    <div>
      <IconOr style={{ height: 24, width: 24, marginBottom: 4 }}  className="text-success"/>
      {' '}
      <em>Match <strong>Any One</strong> of The Following</em>
    </div>
  )
);
const AndTitle = ({ small }) => (
  small ? (
    <div className="text-muted">
      <IconAnd style={{ height: 18, width: 18 }} className="text-info" />
      {' '}
      <em>Match <strong>All</strong></em>
    </div>
  ) : (
    <div>
      <IconAnd style={{ height: 24, width: 24, marginBottom: 4 }} className="text-info" />
      {' '}
      <em>Match <strong>All</strong> of The Following</em>
    </div>
  )
);
const NoneTitle = ({ small }) => (
  small ? (
    <div className="text-muted">
      <i className="fa fa-fw fa-ban text-danger" />
      {' '}
      <em>Exclude <strong>Each</strong></em>
    </div>
  ) : (
    <div>
      <i className="fa fa-fw fa-ban text-danger" />
      {' '}
      <em>Exclude <strong>Each</strong> of The Following</em>
    </div>
  )
);


const NodeView = ({ name, value, className, ...props }) => {
  if (!value) return null;
  if (value.or ||value.and || value.none) {
    const valueSet = (value.or ||value.and || value.none || []);
    return (
      <div className={classnames('small', className)}>
        {value.or && <OrTitle small />}
        {value.and && <AndTitle small />}
        {value.none && <NoneTitle small />}
        <div className="pl-4">
          {valueSet.map && valueSet.map((item, index) => (
            <NodeView
              key={index}
              value={item}
              name={joinName(name, index)}
              className={className}
            />
          ))}
        </div>
      </div>
    );
  }
  if (value.useRegex) {
    return (
      <div className={classnames('small text-muted', className)}>
        <i className="fa fa-fw fa-search" />
        {value.regex}
      </div>
    );
  }
  return (
    <div className={classnames('small text-muted', className)}>
      <i className="fa fa-fw fa-link" />
      {value.term}
    </div>
  );
};
const NodeSetOr = HOCToggleable(({ name, itemProps, parent, onChange, findValue, ...props }) => {
  const value = isArray(props.value) ? props.value : [];
  return (
    <div className="card card-outline-success mb-2">
      <div className="card-header">
        <div className="d-flex justify-content-start">
          <OrTitle />
          <span className="ml-auto">
            {props.on && (
              <BtnRemove
                name={name}
                value={value}
                name={parent.name}
                findValue={findValue}
                onChange={onChange}
              />
            )}
            <CardControl {...props} />
          </span>
        </div>
      </div>
      {props.on && (
        <div className="card-block">
          {isArray(value) && value.length === 0 && (<Empty>No URLs</Empty>)}
          {isArray(value) && value.length > 0 && value.map((item, index) => (
            <NodeAutoField
              key={index}
              name={joinName(name, index)}
              on
              {...itemProps}
              className="card-outline-success"
            />
          ))}
          <div className="text-right mt-2">
            <BtnAdd name={name} value={value} onChange={onChange} showAnd={false} />
          </div>
        </div>
      )}
      {!props.on && (
        <div className="card-block">
          {isArray(value) && value.length === 0 && (<Empty>No URLs</Empty>)}
          {isArray(value) && value.length > 0 && value.map((item, index) => (
            <NodeView
              key={index}
              value={item}
              name={joinName(name, index)}
              className="card-outline-success"
            />
          ))}
        </div>
      )}
    </div>
  );
});

const canAddNone = (name, value) => {
  if (!/ruleSetAnd$/.test(name)) return false;
  if (value.length === 0) return true;
  if (value.filter(x => x && x.none).length === 0) return true;
  return false;
};
const NodeSetAnd = HOCToggleable(({ name, itemProps, parent, onChange, findValue, ...props }) => {
  const value = isArray(props.value) ? props.value : [];
  return (
    <div className="card card-outline-info mb-2">
      <div className="card-header">
        <div className="d-flex justify-content-start">
          <AndTitle />
          <span className="ml-auto">
            {props.on && (
              <BtnRemove
                name={name}
                value={value}
                name={parent.name}
                findValue={findValue}
                onChange={onChange}
              />
            )}
            <CardControl {...props} />
          </span>
        </div>
      </div>
      {props.on && (
        <div className="card-block">
          {isArray(value) && value.length === 0 && (<Empty>No URLs</Empty>)}
          {isArray(value) && value.length > 0 && value.map((item, index) => (
            <NodeAutoField
              key={index}
              name={joinName(name, index)}
              on
              {...itemProps}
              className="card-outline-info"
            />
          ))}
          <div className="text-right mt-2">
            <BtnAdd
              name={name}
              value={value}
              onChange={onChange}
              showAnd={false}
              showNone={canAddNone(name, value)}
            />
          </div>
        </div>
      )}
      {!props.on && (
        <div className="card-block">
          {isArray(value) && value.length === 0 && (<Empty>No URLs</Empty>)}
          {isArray(value) && value.length > 0 && value.map((item, index) => (
            <NodeView
              key={index}
              value={item}
              name={joinName(name, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
});
const NodeSetNone = HOCToggleable(({ name, itemProps, parent, onChange, findValue, ...props }) => {
  const value = isArray(props.value) ? props.value : [];
  return (
    <div className="card card-outline-danger mb-2">
      <div className="card-header">
        <div className="d-flex justify-content-start">
          <NoneTitle />
          <span className="ml-auto">
            {props.on && (
              <BtnRemove
                name={name}
                value={value}
                name={parent.name}
                findValue={findValue}
                onChange={onChange}
              />
            )}
            <CardControl {...props} />
          </span>
        </div>
      </div>
      {props.on && (
        <div className="card-block">
          {isArray(value) && value.length === 0 && (<Empty>No Exclusions</Empty>)}
          {isArray(value) && value.length > 0 && value.map((item, index) => (
            <NodeAutoField
              key={index}
              name={joinName(name, index)}
              on
              {...itemProps}
              className="card-outline-danger"
            />
          ))}
          <div className="text-right mt-2">
            <BtnAdd name={name} value={value} onChange={onChange} showOr={false} />
          </div>
        </div>
      )}
      {!props.on && (
        <div className="card-block">
          {isArray(value) && value.length === 0 && (<Empty>No Exclusions</Empty>)}
          {isArray(value) && value.length > 0 && value.map((item, index) => (
            <NodeView
              key={index}
              value={item}
              name={joinName(name, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
});


const NodeBasic = ({ name, value, findValue, onChange, parent, className, on }) => {
  if (value && value.or) {
    return <NodeAutoField
      name={joinName(name, 'or')}
      className={className}
      on={on}
    />
  }
  if (value && value.and) {
    return <NodeAutoField
      name={joinName(name, 'and')}
      className={className}
      on={on}
    />
  }
  if (value && value.none) {
    return <NodeAutoField
      name={joinName(name, 'none')}
      className={className}
      on={on}
    />
  }
  const useRegex = findValue(joinName(name, 'useRegex'));
  return (
    <div className={classnames('card mb-2', className)}>
      <div className="card-block">
        <div className="small d-flex justify-content-start" style={{ marginTop: -10 }}>
          <code className="pb-0">{name.replace(/conf\..*\.and/, 'rules.and')}</code>
          <div className="ml-auto">
            <BtnRemove
              value={value}
              name={name}
              findValue={findValue}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <SelectUseRegex
              name={joinName(name, 'useRegex')}
              value={useRegex}
            />
          </div>
          <div className="col-10">
            {!useRegex && (
              <TextField label={false} grid={false} name={joinName(name, 'term')} />
            )}
            {useRegex && (
              <TextField label={false} grid={false} name={joinName(name, 'regex')} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-10 form-inline">
            <label className="mr-sm-2">Max</label>
            <NumberPicker name={joinName(name, 'max')} />
            <label className="ml-sm-2 mr-sm-2">Min</label>
            <NumberPicker name={joinName(name, 'min')} />
          </div>
        </div>
      </div>
    </div>
  );
};
NodeBasic.defaultProps = {
  className: 'card-outline-default',
};



const isLastNumber = (last) => !isNaN(parseInt(last, 10));
const defaultForLast = last => {
  if (last === 'none') return [];
  if (last === 'or') return [];
  if (last === 'and') return [];
  return null;
}
const isNameValid = (name) => {
  if (/none\..*none\./.test(name)) {
    console.error('invalid name, should not nest none', name);
    return false;
  }
  return true;
}
const determineComponentFromProps = props => {
  const { name, value } = props;
  if (!name) throw new Error('name is not passed into NodeAuto');
  if (typeof name !== 'string') throw new Error('name is not a string for NodeAuto');
  if (!isNameValid(name)) throw new Error('name is not valid for NodeAuto: ' + name);

  const nameParts = name.split('.');
  const last = nameParts.pop();

  const current = value || defaultForLast(last);
  if (!current && current !== 0) return null;

  // handle sets
  if (['or', 'and', 'none'].indexOf(last) !== -1 && !isArray(current)) {
    console.error(last, 'is not array', name, last, current);
    return null;
  }

  if (last === 'ruleSetAnd') return NodeSetAnd;
  if (last === 'and') return NodeSetAnd;
  if (last === 'or') return NodeSetOr;
  if (last === 'none') return NodeSetNone;
  // // handle nested `or` node
  // if (current && current.or && isArray(current.or)) return NodeSet;
  // // handle nested `and` node
  // if (current && current.and && isArray(current.and)) return NodeSet;
  // handle basic node (child of array, without a nested or/and)
  if (isLastNumber(last)) return NodeBasic;

  return null;
};

const NodeAuto = props => {
  // This way we don't care about unhandled cases - we use default
  // AutoField as a fallback component.
  const Component = determineComponentFromProps(props) || AutoField;
  return (<Component {...props} />);
};
const NodeAutoField = connectField(NodeAuto, {
  includeParent: true,
  ensureValue:    false,
  includeInChain: false,
  initialValue:   false
});

// --------------------------------
// ACTUAL ROOT LEVEL ELEMENT
//   - always an array, treated as an "and"
const RevIpRules = ({ name, ...props }) => (
  <div className="form form-horizontal">
    <NodeAutoField name={name} label={false} />
  </div>
);


RevIpRules.propTypes = {
  children: React.PropTypes.string,
  onClick: React.PropTypes.func,
  style: React.PropTypes.object,
};

export default RevIpRules;
