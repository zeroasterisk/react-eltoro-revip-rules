import classnames from 'classnames';
import isArray from 'lodash/isArray';
import React, {Children} from 'react';
import connectField from 'uniforms/connectField';
import joinName     from 'uniforms/joinName';
import NestField from 'uniforms-bootstrap4/NestField';
import AutoField from 'uniforms-bootstrap4/AutoField';
import TextField from 'uniforms-bootstrap4/TextField';
import SelectField from 'uniforms-bootstrap4/SelectField';
import NumField from 'uniforms-bootstrap4/NumField';

import HOCToggleable from './HOCToggleable';
import BtnRemove from './BtnRemove';

import IconAnd from './IconAnd';
import IconOr from './IconOr';

const BtnsAdd = ({ showAnd, showOr, value, onChange }) => (
  <div className="btn-group btn-group-sm">
    <button
      className="btn btn-secondary"
      onClick={() => onChange(value.concat([{ term: '', use: 'term' }]))}
    >
      <i className="fa fa-plus fa-fw text-default" />{' '}
      Add Term/URL
    </button>
    {showOr && (
      <button
        className="btn btn-secondary"
        onClick={() => onChange(value.concat([{ or: [] }]))}
      >
        <i className="fa fa-plus fa-fw text-info" />{' '}
        Add Nested Optional Set (match any one in set)
      </button>
    )}
    {showAnd && (
      <button
        className="btn btn-secondary"
        onClick={() => onChange(value.concat([{ and: [] }]))}
      >
        <i className="fa fa-plus fa-fw text-primary" />{' '}
        Add Nested Required Set (match everyone in set)
      </button>
    )}
  </div>
);
BtnsAdd.defaultProps = {
  showAnd: true,
  showOr: true,
};
const CardControl = ({ on, toggle }) => (
  <button className="btn btn-sm btn-link" onClick={toggle}>
    <i className={classnames('fa fa-fw', { 'fa-caret-up': on, 'fa-caret-down': !on })} />
  </button>
);
const Empty = ({ children }) => <em className="text-muted" style={{ opacity: 0.6 }}>{children}</em>;
const OrTitle = ({ small }) => (
  small ? (
    <div className="text-muted">
      <IconOr style={{ height: 18, width: 18, marginBottom: 4 }} />
      {' '}
      <em>Match <strong>Any One</strong> of The Following</em>
    </div>
  ) : (
    <div>
      <IconOr style={{ height: 24, width: 24, marginBottom: 4 }} />
      {' '}
      <em>Match <strong>Any One</strong> of The Following</em>
    </div>
  )
);
const AndTitle = ({ small }) => (
  small ? (
    <div className="text-muted">
      <IconAnd style={{ height: 18, width: 18 }} />
      {' '}
      <em>Match <strong>All</strong></em>
    </div>
  ) : (
    <div>
      <IconAnd style={{ height: 24, width: 24, marginBottom: 4 }} />
      {' '}
      <em>Match <strong>All</strong> of The Following</em>
    </div>
  )
);


const NodeView = ({ name, value, className, ...props }) => {
  if (!value) return null;
  if (value.or) {
    return (
      <div className={classnames('small', className)}>
        <OrTitle small />
        <div className="pl-4">
          {value.or.map && value.or.map((item, index) => (
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
  if (value.and) {
    return (
      <div className={classnames('small', className)}>
        <AndTitle small />
        <div className="pl-4">
          {value.and.map && value.and.map((item, index) => (
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
  if (value.use === 'regex') {
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
const NodeSetOr = HOCToggleable(({ name, value, itemProps, parent, onChange, findValue, ...props }) => (
  <div className="card card-outline-info mb-2">
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
        {value.map && value.length === 0 && (<Empty>No URLs</Empty>)}
        {value.map && value.length > 0 && value.map((item, index) => (
          <NodeAutoField
            key={index}
            name={joinName(name, index)}
            on
            {...itemProps}
            className="card-outline-info"
          />
        ))}
        <div className="text-right mt-2">
          <BtnsAdd name={name} value={value} {...props} showAnd={false} />
        </div>
      </div>
    )}
    {!props.on && (
      <div className="card-block">
        {value.map && value.length === 0 && (<Empty>No URLs</Empty>)}
        {value.map && value.length > 0 && value.map((item, index) => (
          <NodeView
            key={index}
            value={item}
            name={joinName(name, index)}
            className="card-outline-info"
          />
        ))}
      </div>
    )}
  </div>
));

const NodeSetAnd = HOCToggleable(({ name, value, itemProps, ...props }) => (
  <div className="card card-outline-default mb-2">
    <div className="card-header">
      <div className="d-flex justify-content-start">
        <AndTitle />
        <span className="ml-auto"><CardControl {...props} /></span>
      </div>
    </div>
    {props.on && (
      <div className="card-block">
        {value.map && value.length === 0 && (<Empty>No URLs</Empty>)}
        {value.map && value.length > 0 && value.map((item, index) => (
          <NodeAutoField
            key={index}
            name={joinName(name, index)}
            on
            {...itemProps}
          />
        ))}
        <div className="text-right mt-2">
          <BtnsAdd name={name} value={value} {...props} showAnd={false} />
        </div>
      </div>
    )}
    {!props.on && (
      <div className="card-block">
        {value.map && value.length === 0 && (<Empty>No URLs</Empty>)}
        {value.map && value.length > 0 && value.map((item, index) => (
          <NodeView
            key={index}
            value={item}
            name={joinName(name, index)}
          />
        ))}
      </div>
    )}
  </div>
));
const NodeSetNot = HOCToggleable(({ name, findValue, itemProps, ...props }) => {
  const orName = joinName(name, 'or');
  const orValue = findValue(orName);
  return (
    <div className="card card-outline-warning mb-2">
      <div className="card-header">
        <div className="d-flex justify-content-start">
          <em>Exclude <strong>Each</strong> of The Following</em>
          <span className="ml-auto"><CardControl {...props} /></span>
        </div>
      </div>
      {props.on && (
        <div className="card-block">
          {orValue.map && orValue.length === 0 && (<Empty>No Exclusions</Empty>)}
          {orValue.map && orValue.length > 0 && orValue.map((item, index) => (
            <NodeAutoField
              key={index}
              name={joinName(orName, index)}
              on
              {...itemProps}
              className="card-outline-warning"
            />
          ))}
          <div className="text-right mt-2">
            <BtnsAdd name={name} value={value} {...props} showAnd={false} />
          </div>
        </div>
      )}
      {!props.on && (
        <div className="card-block">
          {orValue.map && orValue.length === 0 && (<Empty>No Exclusions</Empty>)}
          {orValue.map && orValue.length > 0 && orValue.map((item, index) => (
            <NodeView
              key={index}
              value={item}
              name={joinName(orName, index)}
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
  const useFld = findValue(joinName(name, 'use'))
    || (findValue(joinName(name, 'regex')) && 'regex')
    || 'term';
  return (
    <div className={classnames('card mb-2', className)}>
      <div className="card-block">
        <div className="small d-flex justify-content-start" style={{ marginTop: -10 }}>
          <code className="pb-0">{name}</code>
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
            <SelectField label={false} grid={false}
              name={joinName(name, 'use')}
              options={{ term: 'Term/URL', regex: 'Regex' }}
              value={useFld}
            />
          </div>
          <div className="col-10">
            {useFld === 'term' && (
              <TextField label={false} grid={false} name={joinName(name, 'term')} />
            )}
            {useFld === 'regex' && (
              <TextField label={false} grid={false} name={joinName(name, 'regex')} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <NumField grid={6} label="Max" name={joinName(name, 'max')} />
          </div>
          <div className="col-4">
            <NumField grid={6} label="Min" name={joinName(name, 'min')} />
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
  if (last === 'not') return { or: [] };
  if (last === 'or') return [];
  if (last === 'and') return [];
  return null;
}
const isNameValid = (name) => {
  if (/not\./.test(name) && !/not\.or/.test(name)) return false;
  if (/not\..*not\./.test(name)) return false;
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
  if (last === 'or' && !isArray(current)) {
    console.error('OR is not array', name, last, current);
    return null;
  }
  if (last === 'and' && !isArray(current)) {
    console.error('AND is not array', name, last, current);
    return null;
  }

  console.log('determineComponentFromProps', props, last, current);
  if (last === 'or') return NodeSetOr;
  if (last === 'and') return NodeSetAnd;
  if (last === 'not') return NodeSetNot;
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


const RevIpRules = ({ name, ...props }) => (
  <NestField className="form form-horizontal" name={name} label={false}>
    <NodeAutoField name="and" />
    <NodeAutoField name="not" />
  </NestField>
);


RevIpRules.propTypes = {
  children: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  style: React.PropTypes.object,
};

export default RevIpRules;
