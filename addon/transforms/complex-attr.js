import DS from 'ember-data';
import {isPresent} from '@ember/utils';
import {singularize} from 'ember-inflector';
import {dasherize} from '@ember/string';
import {getOwner} from "@ember/application";
import {get} from '@ember/object';

const nullTransform = {
  deserialize: (_) => _,
  serialize: (_) => _
};

export default DS.Transform.extend({

  /**
   * @method attributeMetadataForType
   * @param type
   * @returns {{}}
   */
  attributesMetadataForType(type) {
    const ComplexAttrRegistration = this.registrationForType(type);

    const attributeMetadata = {};
    ComplexAttrRegistration.eachComputedProperty((name, meta) => {
      if (meta.isComplexAttribute) {
        attributeMetadata[name] = meta;
      }
    });

    return attributeMetadata;
  },

  /**
   * @method serializeAttributes
   * @param attributes
   * @param attributesMetadata
   */
  serializeAttributes(attributesMetadata, attributes) {
    return Object.keys(attributesMetadata).reduce((serializedAttributes, attributeName) => {
      const {type, options} = attributesMetadata[attributeName];

      const transform = this.transformForType(type);

      serializedAttributes[dasherize(attributeName)] = transform.serialize(get(attributes, attributeName), options);

      return serializedAttributes;
    }, {});
  },

  /**
   * Applies transforms to each of the complex-attrs properties (ex. number, string etc etc). This is akin to when
   * the properties of an ember model are transformed, only at the complex-attr level.
   *
   * @method deserializeAttributes
   * @param {Object} attributesMetadata Object that contains the complex-attr-array type and options
   * @param {Object} attributes Object representing a complex-attr whose properties are to be transformed (i.e. to string, number etc).
   * @returns {{}} A new record who properties are the transformed values of the input record
   */
  deserializeAttributes(attributesMetadata, attributes) {
    return Object.keys(attributesMetadata).reduce((deserializedAttributes, attributeName) => {
      const {type, options} = attributesMetadata[attributeName];

      const transform = this.transformForType(type);

      // apply the transform (could be a number, string, boolean etc etc).
      deserializedAttributes[attributeName] = transform.deserialize(attributes[dasherize(attributeName)], options);

      return deserializedAttributes;
    }, {});
  },

  /**
   * @method transformForType
   * @param {String} type The type of transform to be resolved
   * @returns {DS.Transform} The transformer for the given type
   */
  transformForType(type) {
    return isPresent(type) ? getOwner(this).lookup(`transform:${type}`) : nullTransform;
  },

  /**
   * @method factoryForType
   * @param {String} type The type of complex-attr
   * @returns {*|{class, create}} The factory for the given complex-attr type
   */
  factoryForType(type) {
    return getOwner(this).factoryFor(this.keyForType(type));
  },

  /**
   * @method registrationForType
   * @param {String} type The type of complex-attr
   * @returns {Function | * | {}} The registered complex-attr for the given type
   */
  registrationForType(type) {
    return getOwner(this).resolveRegistration(this.keyForType(type));
  },

  /**
   * @method keyForType
   * @param {String} type The type of complex-attr to construct a container key for
   * @returns {string} The container key for the given complex-attr
   */
  keyForType(type) {
    return `model:complex-attrs/${singularize(type)}`;
  }
});
