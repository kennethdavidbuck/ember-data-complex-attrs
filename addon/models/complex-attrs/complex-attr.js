import Ember from 'ember';
import EmberObject from '@ember/object';
import {uuid} from 'ember-cli-uuid';
import attr from '@rigo/ember-data-complex-attrs/attr';
import {copy} from '@ember/object/internals';

const ComplexAttr = EmberObject.extend(Ember.Copyable);

ComplexAttr.reopenClass({
  attributesMetadata() {
    // TODO: Should we cache this value?
    const attributeMetadata = {};

    this.eachComputedProperty((name, meta) => {
      if (meta.isComplexAttribute) {
        attributeMetadata[name] = meta;
      }
    });

    return attributeMetadata;
  }
});

ComplexAttr.reopen({
  id: attr('string', {
    defaultValue: () => uuid()
  }),

  copy(deep) {
    const klass = this.constructor;
    const attributesMetadata = klass.attributesMetadata();

    const properties = Object.keys(attributesMetadata).reduce((result, attributeName) => {
      // do not copy id!
      if(attributeName === 'id') {
        return result;
      }

      result[attributeName] = deep ? copy(this.get(attributeName), deep) : this.get(attributeName);

      return result;
    }, {});

    return klass.create(properties);
  }
});

export default ComplexAttr;
