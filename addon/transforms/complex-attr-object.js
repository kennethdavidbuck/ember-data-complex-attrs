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

    const ComplexAttrRegistration = this.registrationForType(type);

    return ComplexAttrRegistration.create(this.deserializeAttributes(ComplexAttrRegistration.complexAttrsMetadata(), serialized));
  },

  /**
   * @override
   */
  serialize(deserialized, {type}) {
    if (isBlank(deserialized)) {
      return null;
    }

    const ComplexAttrRegistration = this.registrationForType(type);
    const attributesMetadata = ComplexAttrRegistration.complexAttrsMetadata();

    return this.serializeAttributes(attributesMetadata, deserialized);
  }
});
