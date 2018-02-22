import {typeOf} from '@ember/utils';
import {computed} from '@ember/object';
import {assign} from '@ember/polyfills';

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
export default function (type, options) {
  const mergedOptions = assign({
    copyable: true
  }, options || {});

  const meta = ({
    type: type,
    isComplexAttr: true,
    options: mergedOptions
  });

  return computed({
    get(key) {
      return getDefaultValue(this, mergedOptions, key);
    },
    set(key, value) {
      return value;
    }
  }).meta(meta);
}
