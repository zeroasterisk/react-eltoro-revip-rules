import React from 'react';
import { storiesOf, action } from '@storybook/react';
import AutoForm from 'uniforms-bootstrap4/AutoForm';

import RevIpRules from '../index';

import RevIpRulesCustom from '../custom';

// fancy GraphQLBridge and configuation for testing
//   self-referential stuff
import schema from './schema';


const mock_bucket = {
  name: 'mock bucket',
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
            { use: 'regex', regex: 'examples?\.com' },
          ] },
        ],
        not: {
          or: [
            { term: 'http://example.com/exclude1' },
            { term: 'http://example.com/exclude2*suffix' },
          ],
        },
      },
    },
  },
};

storiesOf('RevIpRules', module)
  .add('custom UI (nonfunctional)', () => (
    <div className="container">
      <RevIpRulesCustom
        data={mock_bucket.conf.revIpRules.rule}
        onChange={ action('RevIpRules changed') }
      />
    </div>
  ))
  .add('plain autoform', () => (
    <AutoForm
      grid={3}
      schema={schema}
      onSubmit={action('submitted')}
      model={mock_bucket}
    />
  ))
  .add('RevIpRules autoform', () => (
    <AutoForm
      grid={3}
      schema={schema}
      onSubmit={action('submitted')}
      model={mock_bucket}
    >
      <RevIpRules name="conf.revIpRules.rule" />
    </AutoForm>
  ))
  .add('default view', () => (
    <RevIpRules onChange={ action('RevIpRules changed') } />
  ))
;
