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
    const attributeMetadata = ComplexAttrRegistration.attributesMetadata();

    return A(serialized.map((attributes) => {
      return ComplexAttrRegistration.create(this.deserializeAttributes(attributeMetadata, attributes));
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
    const attributeMetadata = ComplexAttrRegistration.attributesMetadata();

    return deserialized.map((attributes) => this.serializeAttributes(attributeMetadata, attributes));
  }
});
