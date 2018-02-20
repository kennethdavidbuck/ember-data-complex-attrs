import {A, isArray} from '@ember/array';
import ComplexAttrTransform from '@rigo/ember-data-complex-attrs/transforms/complex-attr';

export default ComplexAttrTransform.extend({

  /**
   * @override
   */
  deserialize(serialized, {type}) {
    if (!isArray(serialized)) {
      return A();
    }

    const ComplexAttrRegistration = this.registrationForType(type);
    const attributesMetadata = ComplexAttrRegistration.complexAttrsMetadata();

    return A(serialized.map((attributes) => {
      return ComplexAttrRegistration.create(this.deserializeAttributes(attributesMetadata, attributes));
    }));
  },

  /**
   * @override
   */
  serialize(deserialized, {type}) {
    if (!isArray(deserialized)) {
      return [];
    }

    const ComplexAttrRegistration = this.registrationForType(type);
    const attributesMetadata = ComplexAttrRegistration.complexAttrsMetadata();

    return deserialized.map((attributes) => this.serializeAttributes(attributesMetadata, attributes));
  }
});
