import {isBlank} from '@ember/utils';
import {A} from '@ember/array';
import ComplexAttrTransform from '@rigo/ember-data-complex-attrs/transforms/complex-attr';

export default ComplexAttrTransform.extend({

  /**
   * @override
   */
  deserialize(serialized, {type}) {
    if (isBlank(serialized)) {
      return A();
    }

    const ComplexAttrFactory = this.factoryForType(type);
    const ComplexAttrRegistration = this.registrationForType(type);
    const attributeMetadata = ComplexAttrRegistration.attributesMetadata();

    return A(serialized.map((attributes) => {
      return ComplexAttrFactory.create(this.deserializeAttributes(attributeMetadata, attributes));
    }));
  },

  /**
   * @override
   */
  serialize(deserialized, {type}) {
    if (isBlank(deserialized)) {
      return [];
    }

    const ComplexAttrRegistration = this.registrationForType(type);
    const attributeMetadata = ComplexAttrRegistration.attributesMetadata();

    return deserialized.map((attributes) => this.serializeAttributes(attributeMetadata, attributes));
  }
});
