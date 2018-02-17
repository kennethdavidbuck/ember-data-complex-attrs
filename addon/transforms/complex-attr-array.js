import {A, isArray} from '@ember/array';
import ComplexAttrTransform from '@rigo/ember-data-complex-attrs/transforms/complex-attr';

export default ComplexAttrTransform.extend({

  /**
   * @override
   */
  deserialize(serialized, {type}) {
    if (!isArray(serialized)) {
      return;
    }

    const ComplexAttrFactory = this.factoryForType(type);
    const attributeMetadata = this.attributesMetadataForType(type);

    return A(serialized.map((attributes) => {
      return ComplexAttrFactory.create(this.deserializeAttributes(attributeMetadata, attributes));
    }));
  },

  /**
   * @override
   */
  serialize(deserialized, {type}) {
    if (!isArray(deserialized)) {
      return null;
    }

    const attributeMetadata = this.attributesMetadataForType(type);

    return deserialized.map((attributes) => this.serializeAttributes(attributeMetadata, attributes));
  }
});
