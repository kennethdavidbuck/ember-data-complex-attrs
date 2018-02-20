import EmberObject from '@ember/object';
import ModelsComplexAttrsIdentifiableMixin from '@rigo/ember-data-complex-attrs/mixins/models/complex-attrs/identifiable';
import { module, test } from 'qunit';

module('Unit | Mixin | models/complex attrs/identifiable');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModelsComplexAttrsIdentifiableObject = EmberObject.extend(ModelsComplexAttrsIdentifiableMixin);
  let subject = ModelsComplexAttrsIdentifiableObject.create();
  assert.ok(subject);
});
