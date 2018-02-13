import EmberObject from '@ember/object';
import {uuid} from 'ember-cli-uuid';
import attr from 'ember-data-complex-attrs/attr'

const BaseComplexAttr = EmberObject.extend({
  id: attr('string', {
    defaultValue: () => uuid()
  })
});

export default BaseComplexAttr;
