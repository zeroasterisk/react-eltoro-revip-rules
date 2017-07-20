# UI ElToro RevIp Rules Component

This is a [Uniforms](https://github.com/vazco/uniforms/) React Component.

### Features

- [x] infinite nesting capabilities for `and`, `or`, and `none` sets
- [x] each "node" which is not a set supports `term` or `regex` and `max` and `min`
- [x] expand / collapse functionality, per set and total
- [x] read only, collapsed UI
- [ ] bulk edit set (basically YAML support)

### Demo

See a demo at ....

Run yourself by:

```
npm i
npm run storybook
```

Then see it at http://localhost:9010/

### Usage

```
# install peer dependancies
npm i --save uniforms uniforms-bootstrap4 react-number-editor lodash
# install package
npm i --save ui-eltoro-revip-rules
```

```jsx
import React from 'react';
import AutoForm from 'uniforms-bootstrap4/AutoForm';
import ErrorsField from 'uniforms-bootstrap4/ErrorsField';
import SubmitField from 'uniforms-bootstrap4/SubmitField';
import RevIpRules from 'ui-eltoro-revip-rules';

const MyComponent = () => (
  <AutoForm schema={schema} model={model} onSubmit={console.log}>
    <RevIpRules name="conf.revIpRules.rule" />
    <ErrorsField />
    <SubmitField />
  </AutoForm>
);
```

For more information on usage, see [stories](./src/stories/index.js)

### TODO - Extend - Abstract Nesting

The infinite nesting capabilities for `and`, `or`, and `none` sets is a compelling feature.

It is likely that we could take "that" and abstract away the "node" to a generic component,
at which point, the set handling becomes a HOC wrapper for whatever you want to edit, in a nested structure.


