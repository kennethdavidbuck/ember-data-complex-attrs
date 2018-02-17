import ComplexAttrTransform from '@rigo/ember-data-complex-attrs/transforms/complex-attr';
import {isBlank} from '@ember/utils';

export default ComplexAttrTransform.extend({

  /**
   * @override
   */
  deserialize(serialized, {type}) {
    if (isBlank(serialized)) {
      return;
    }

    const ComplexAttrFactory = this.factoryForType(type);
    const ComplexAttrRegistration = this.registrationForType(type);

    return ComplexAttrFactory.create(this.deserializeAttributes(ComplexAttrRegistration.attributesMetadata(), serialized));
  },

  /**
   * @override
   */
  serialize(deserialized, {type}) {
    if (isBlank(deserialized)) {
      return;
    }
    const ComplexAttrRegistration = this.registrationForType(type);
    const attributeMetadata = ComplexAttrRegistration.attributesMetadata();

    return this.serializeAttributes(attributeMetadata, deserialized);
  }
});
