import result from 'lodash/result';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import each from 'lodash/each';
import map from 'lodash/map';
import _set from 'lodash/set';
import React from 'react';

const NodeSetOr = ({ path, children }) => (
  <div className="card card-outline-info mb-2">
    <div className="card-header">
      <em>Match <strong>Any One</strong> of The Following</em>
    </div>
    <div className="card-block">
      {children}
      <div className="text-right mt-2">
        <div className="btn-group btn-group-sm">
          <button className="btn btn-secondary">
            <i className="fa fa-plus fa-fw" />{' '}
            Add Term/URL
          </button>
          <button className="btn btn-info">
            <i className="fa fa-plus fa-fw" />{' '}
            Add Optional Set (match any one in set)
          </button>
          <button className="btn btn-info">
            <i className="fa fa-plus fa-fw" />{' '}
            Add Required Set (match everyone in set)
          </button>
        </div>
      </div>
    </div>
  </div>
);
const NodeSetAnd = ({ path, children }) => (
  <div className="card card-outline-default mb-2">
    <div className="card-header"><em>Match <strong>All</strong> of The Following</em></div>
    <div className="card-block">
      {children}
      <div className="text-right mt-2">
        <div className="btn-group btn-group-sm">
          <button className="btn btn-secondary">
            <i className="fa fa-plus fa-fw" />{' '}
            Add Term/URL
          </button>
          <button className="btn btn-info">
            <i className="fa fa-plus fa-fw" />{' '}
            Add Optional Set (match any one in set)
          </button>
        </div>
      </div>
    </div>
  </div>
);
const NodeSetNot = ({ path, children }) => (
  <div className="card card-outline-warning mb-2">
    <div className="card-header"><em>Exclude <strong>Each</strong> of The Following</em></div>
    <div className="card-block">
      {children}
    </div>
  </div>
);

class BtnRemove extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }
  activate = () => this.setState({ active: true })
  cancel = () => this.setState({ active: false })
  trash = () => {
    // remove this node from path
    const { data, path } = this.props;
    const pathParts = path.split('.');
    const fieldIndex = parseInt(pathParts.pop(), 10);
    const pathBase = pathParts.join('.');
    const value = result(data, pathBase);
    const newVal = [].concat(value.slice(0,  fieldIndex)).concat(value.slice(1 + fieldIndex));
    this.props.onChange(_set(...data, pathBase, newVal));
  }
  render() {
    return (
      <div className="btn-group btn-group-sm">
        {this.state.active && (
          <button onClick={this.trash} className="btn btn-danger">
            <i className="fa fa-trash" /> Remove
          </button>
        )}
        {this.state.active && (
          <button onClick={this.cancel} className="btn btn-secondary">
            <i className="fa fa-remove" /> Cancel
          </button>
        )}
        {!this.state.active && (
          <button onClick={this.activate} className="btn btn-link text-muted">
            <i className="fa fa-remove" />
          </button>
        )}
      </div>
    );
  }
}

const NodeBasic = ({ path, data, term, max, min, onChange }) => (
  <div className="card card-outline-default mb-2">
    <div className="card-block">
      <div className="small d-flex justify-content-start" style={{ marginTop: -10 }}>
        <code className="pb-0">{path}</code>
        <div className="ml-auto"><BtnRemove path={path} data={data} onChange={onChange} /></div>
      </div>
      <div className="form-group row">
        <label className="col-2 col-form-label">Term/URL</label>
        <div className="col-10">
          <input className="form-control" type="text" value={term} />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-2 col-form-label">Max</label>
        <div className="col-3">
          <input className="form-control" type="number" value={max} />
        </div>
        <label className="col-2 col-form-label">Min</label>
        <div className="col-3">
          <input className="form-control" type="number" value={min} />
        </div>
      </div>
    </div>
  </div>
);

const isPathValid = (path) => {
  if (/not\./.test(path) && !/not\.or/.test(path)) return false;
  if (/not\..*not\./.test(path)) return false;
  return true;
}
const isLastNumber = (last) => !isNaN(parseInt(last, 10));
const defaultForLast = last => {
  if (last === 'not') return { or: [] };
  if (last === 'or') return [];
  if (last === 'and') return [];
  return null;
}
const NodeAutoMapArray = (data, path, node, i) => <NodeAuto path={`${path}.${i}`} data={data} />;

const NodeAuto = ({ path, data }) => {
  if (!path) throw new Error('path is not passed into NodeAuto');
  if (typeof path !== 'string') throw new Error('path is not a string for NodeAuto');
  if (!isPathValid(path)) throw new Error('path is not valid for NodeAuto: ' + path);
  if (!data) throw new Error('data is not passed into NodeAuto');
  if (typeof data !== 'object') throw new Error('data is not a object for NodeAuto');

  const pathParts = path.split('.');
  const last = pathParts.pop();

  const current = result(data, path) || defaultForLast(last);
  if (!current && current !== 0) return null;

  // handle sets
  if (last === 'or' && !isArray(current)) return <span>OR is not array</span>;
  if (last === 'and' && !isArray(current)) return <span>AND is not array</span>;

  if (last === 'or') {
    return (
      <NodeSetOr path={path}>
        {map(current, NodeAutoMapArray.bind(null, data, path))}
      </NodeSetOr>
    );
  }
  if (last === 'and') {
    return (
      <NodeSetAnd path={path}>
        {map(current, NodeAutoMapArray.bind(null, data, path))}
      </NodeSetAnd>
    );
  }
  if (last === 'not') {
    const pathOr = `${path}.or`;
    const currentOr = result(data, pathOr) || [];
    return (
      <NodeSetNot path={path}>
        {map(currentOr, NodeAutoMapArray.bind(null, data, pathOr))}
      </NodeSetNot>
    );
  }
  // handle nested `or` node
  if (current && current.or && isArray(current.or)) {
    return <NodeAuto data={data} path={`${path}.or`} />;
  }
  // handle nested `and` node
  if (current && current.and && isArray(current.and)) {
    return <NodeAuto data={data} path={`${path}.and`} />;
  }
  // handle basic node (child of array, without a nested or/and)
  if (isLastNumber(last)) {
    return <NodeBasic data={data} path={path} {...current} />;
  }
  return <span>ummm...</span>;
};

const RevIpRules = ({ data, ...props }) => (
  <div className="form form-horizontal">
    <NodeAuto path="and" data={data} />
    <NodeAuto path="not" data={data} />
  </div>
);

RevIpRules.propTypes = {
  onClick: React.PropTypes.func,
  style: React.PropTypes.object,
};

export default RevIpRules;
