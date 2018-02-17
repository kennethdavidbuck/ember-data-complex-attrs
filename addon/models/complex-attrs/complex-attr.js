import Ember from 'ember';
import EmberObject from '@ember/object';
import {uuid} from 'ember-cli-uuid';
import attr from '@rigo/ember-data-complex-attrs/attr';

const ComplexAttr = EmberObject.extend(Ember.Copyable, {
  id: attr('string', {
    defaultValue: () => uuid()
  }),

  copy() {}
});

ComplexAttr.reopenClass({
  attributesMetadata() {
    const attributeMetadata = {};

    this.eachComputedProperty((name, meta) => {
      if (meta.isComplexAttribute) {
        attributeMetadata[name] = meta;
      }
    });

    return attributeMetadata;
  },
});

export default ComplexAttr;
