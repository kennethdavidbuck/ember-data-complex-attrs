import {isBlank} from '@ember/utils';
import {A} from '@ember/array';
import ComplexAttrTransform from 'ember-data-complex-attrs/transforms/complex-attr';

export default ComplexAttrTransform.extend({

  /**
   * @override
   */
  deserialize(serialized, {type}) {
    if (isBlank(serialized)) {
      return;
    }

    const ComplexAttrFactory = this.factoryForType(type);
    const attributeMetadata = this.attributeMetadataForType(type);

    return A(serialized.map((attributes) => {
      return ComplexAttrFactory.create(this.deserializeAttributes(attributeMetadata, attributes));
    }));
  },

  /**
   * @override
   */
  serialize(deserialized, {type}) {
    if(isBlank(deserialized)) {
      return;
    }

    const attributeMetadata = this.attributeMetadataForType(type);

    return deserialized.map((attributes) => this.serializeAttributes(attributeMetadata, attributes));
  }
});
