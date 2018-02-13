import ComplexAttrTransform from 'ember-data-complex-attrs/transforms/complex-attr';
import {isBlank} from '@ember/utils';

export default ComplexAttrTransform.extend({

  /**
   * @override
   */
  deserialize(serialized, {type}) {
    if(isBlank(serialized)) {
      return;
    }

    const ComplexAttrFactory = this.factoryForType(type);

    return ComplexAttrFactory.create(this.deserializeAttributes(this.attributesMetadataForType(type), serialized));
  },

  /**
   * @override
   */
  serialize(deserialized, {type}) {
    if(isBlank(deserialized)) {
      return;
    }

    return this.serializeAttributes(this.attributesMetadataForType(type), deserialized);
  }
});
