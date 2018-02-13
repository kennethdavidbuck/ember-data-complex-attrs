import EmberObject, {computed} from '@ember/object';
import {typeOf} from '@ember/utils';
import {uuid} from 'ember-cli-uuid';

function getDefaultValue(complexAttr, options) {
  if (typeOf(options.defaultValue) === 'function') {
    return options.defaultValue.apply(null, arguments);
  }

  return options.defaultValue;
}

/**
 * This is essentially the same as an ember-data attr only it has been customized for the notion of a complex-attr.
 * Regardless, it still works the same way. If you pass in 'string', then the attribute will get parsed as a string etc.
 */
export const attr = function (type, options) {
  const meta = {
    type: type,
    isComplexAttribute: true,
    options: options
  };

  return computed({
    get(key) {
      return getDefaultValue(this, options || {}, key);
    },
    set(key, value) {
      return value;
    }
  }).meta(meta);
};

const BaseComplexAttr = EmberObject.extend({
  id: attr('string', {
    defaultValue: () => uuid()
  })
});

export default BaseComplexAttr;
