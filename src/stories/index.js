import React from 'react';
import { storiesOf, action } from '@storybook/react';
import AutoForm from 'uniforms-bootstrap4/AutoForm';
import ErrorsField from 'uniforms-bootstrap4/ErrorsField';
import SubmitField from 'uniforms-bootstrap4/SubmitField';

import RevIpRules from '../index';

import RevIpRulesCustom from '../custom';

// fancy GraphQLBridge and configuation for testing
//   self-referential stuff
import schema from './schema';


const mock_bucket_1 = {
  name: 'mock bucket 1',
  conf: {
    revIpRules: {
      rule: {
        and: [
          { term: 'http://example.com/require1', max: 10, min: 1 },
          { term: 'http://example.com/require2*' },
          { or: [
            { term: 'http://example.com/one_of_a/maybe', max: 10, min: 1 },
            { and: [
              { term: 'http://example.com/one_of_a/alt' },
              { term: 'http://example.com/one_of_a/other' },
            ] },
            { useRegex: true, regex: 'examples?\.com' },
          ] },
          { none: [
            { term: 'http://example.com/exclude1' },
            { term: 'http://example.com/exclude2*suffix' },
            { and: [
              { term: 'http://example.com/exclude-if-both-a' },
              { term: 'http://example.com/exclude-if-both-b' },
            ] },
          ] },
        ],
      },
    },
  },
};
const mock_bucket_2 = {
  name: 'mock bucket 2',
  conf: {
    revIpRules: {
      rule: {
        and: [
          { or: [
            { term: 'http://example.com/one_of_a/maybe', max: 10, min: 1 },
            { useRegex: true, regex: 'examples?\.com' },
          ] },
        ],
      },
    },
  },
};
const mock_bucket_3 = {
  name: 'mock bucket 3',
  conf: {
    revIpRules: {
      rule: {}
    },
  },
};

storiesOf('RevIpRules', module)
  .add('mock data 1', () => (
    <AutoForm grid={3} schema={schema} onSubmit={action('submitted')} model={mock_bucket_1}>
      <RevIpRules name="conf.revIpRules.rule" />
      <ErrorsField />
      <SubmitField />
    </AutoForm>
  ))
  .add('mock data 2', () => (
    <AutoForm grid={3} schema={schema} onSubmit={action('submitted')} model={mock_bucket_2}>
      <RevIpRules name="conf.revIpRules.rule" />
      <ErrorsField />
      <SubmitField />
    </AutoForm>
  ))
  .add('mock data 3', () => (
    <AutoForm grid={3} schema={schema} onSubmit={action('submitted')} model={mock_bucket_3}>
      <RevIpRules name="conf.revIpRules.rule" />
      <ErrorsField />
      <SubmitField />
    </AutoForm>
  ))
  .add('no data', () => (
    <AutoForm grid={3} schema={schema} onSubmit={action('submitted')} model={{}}>
      <RevIpRules name="conf.revIpRules.rule" />
      <ErrorsField />
      <SubmitField />
    </AutoForm>
  ))
;
