import React from 'react';
import { storiesOf, action } from '@storybook/react';
import AutoForm from 'uniforms-bootstrap4/AutoForm';
import RevIpRules from '../index';

// fancy GraphQLBridge and configuation for testing
//   self-referential stuff
import schema from './schema';

storiesOf('RevIpRules', module)
  .add('plain autoform', () => (
    <AutoForm schema={schema} onSubmit={action('submitted')} />
  ))
  .add('default view', () => (
    <RevIpRules onChange={ action('RevIpRules changed') } />
  ))
;
