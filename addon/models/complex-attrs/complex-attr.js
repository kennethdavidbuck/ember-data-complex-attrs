import Ember from 'ember';
import EmberObject from '@ember/object';
import {copy} from '@ember/object/internals';

const ComplexAttr = EmberObject.extend(Ember.Copyable, {

  /**
   * @override
   */
  copy(deep) {
    const klass = this.constructor;
    const properties = {};

    klass.eachComplexAttr((name, meta) => {
      if (meta.options.copyable) {
        properties[name] = deep ? copy(this.get(name), deep) : this.get(name);
      }
    });

    return klass.create(properties);
  }
});

ComplexAttr.reopenClass({

  /**
   * @method complexAttrsMetadata
   */
  complexAttrsMetadata() {
    const attributeMetadata = {};

    this.eachComplexAttr((name, meta) => {
      attributeMetadata[name] = meta;
    });

    return attributeMetadata;
  },

  /**
   * @method eachComplexAttr
   */
  eachComplexAttr(fn) {
    this.eachComputedProperty((name, meta) => {
      if (meta.isComplexAttr) {
        fn.call(this, name, meta);
      }
    });
  }
});

export default ComplexAttr;
