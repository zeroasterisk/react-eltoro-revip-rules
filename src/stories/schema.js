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

const schemaAST = buildASTSchema(schemaGraphQl).getType('Bucket');

// build settings and details for supported fields
const schemaRuleData = {
  useRegex: { label: 'UI Control' },
  term: {label: 'Term'},
  regex: {label: 'Regex'},
  max: {label: 'max'},
  min: {label: 'min'},
  // sets
  and: {label: 'and'},
  or: {label: 'or'},
  none: {label: 'not any'}, // equivalient to not.or
};

// handle nested nodes
const assignRulePrefix = (prefix, i) => {
  Object.keys(schemaRuleData).forEach((key, j) => {
    const newKey = `${prefix}.\$.${key}`;
    schemaRuleData[newKey] = schemaRuleData[key];
  });
};
['and', 'or', 'none'].forEach(assignRulePrefix);
['and', 'or', 'none'].forEach(assignRulePrefix);
['and', 'or', 'none'].forEach(assignRulePrefix);
['and', 'or', 'none'].forEach(assignRulePrefix);

const schemaData = {
  name: { label: 'Name' },
  conf: { label: 'Conf' },
  'conf.revIpRules': { label: 'Conf for Rev IP' },
  'conf.revIpRules.rule': { label: 'Rules for Rev IP' },
  'conf.revIpRules.rule.and': { label: 'Rules Include' },
  'conf.revIpRules.rule.none': { label: 'Rules Exclude Any of These' },
};
const assignPrefix = (prefix, i) => {
  Object.keys(schemaRuleData).forEach((key, j) => {
    const newKey = `${prefix}.\$.${key}`;
    schemaData[newKey] = schemaRuleData[key];
  });
};
['conf.revIpRules.rule.and', 'conf.revIpRules.rule.none'].forEach(assignPrefix);
console.log(schemaData);


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
