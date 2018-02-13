import {module, test} from 'ember-qunit';
import ComplexAttrTransform from 'ember-data-complex-attrs/transforms/complex-attr';

module('Unit | Transform | complex attr',);

test('#keyForType works', function (assert) {
  assert.expect(1);

  let transform = ComplexAttrTransform.create();

  assert.strictEqual(transform.keyForType('cars'), 'model:complex-attrs/car');
});
