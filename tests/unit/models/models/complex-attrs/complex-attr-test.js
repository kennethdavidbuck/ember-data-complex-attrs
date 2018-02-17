import {module, test} from 'ember-qunit';
import ComplexAttr from '@rigo/ember-data-complex-attrs/models/complex-attrs/complex-attr';
import {copy} from '@ember/object/internals';

module('Unit | Model | models/complex attrs/complex attr', {
  needs: []
});

test('it exists', function (assert) {
  let model =  ComplexAttr.create();

  assert.ok(!!model);
});

test('implements copyable', function (assert) {
  assert.expect(0);

  let model = ComplexAttr.create();

  copy(model);
});
