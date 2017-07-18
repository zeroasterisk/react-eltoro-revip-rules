/**
 * Setup a GraphQL Schema + Bridge
 * npm i --save graphql uniforms graphql-tag
 *
 *
 */
import GraphQLBridge from 'uniforms/GraphQLBridge';
import { buildASTSchema, parse } from 'graphql';

// https://github.com/Swydo/meteor-graphql <-- must update import and webpack to support this
import schemaGraphQl from './schema.graphql';

const schemaAST = buildASTSchema(schemaGraphQl).getType('RuleRoot');

// build settings and details for supported fields
const schemaData = {
  term: {label: 'Term'},
  regex: {label: 'Regex'},
  max: {label: 'max'},
  min: {label: 'min'},
  // sets
  and: {label: 'and'},
  or: {label: 'or'},
  not: {label: 'not'},
};

// handle nested nodes
const assignPrefix = (prefix, i) => {
  Object.keys(schemaData).forEach((key, j) => {
    const newKey = `${prefix}.\$.${key}`;
    schemaData[newKey] = schemaData[key];
  });
};
['and', 'or', 'not'].forEach(assignPrefix);
['and', 'or', 'not'].forEach(assignPrefix);
['and', 'or', 'not'].forEach(assignPrefix);

// build a validator
const schemaValidator = model => {
  const details = [];

  // if (!model.id) {
  //   details.push({ name: 'id', message: 'ID is required!' });
  // }

  if (details.length) {
    // AutoForm will give an error if you pass it an
    // Error object
    // eslint-disable-next-line no-throw-literal
    throw { details };
  }
};

export default new GraphQLBridge(schemaAST, schemaValidator, schemaData);
