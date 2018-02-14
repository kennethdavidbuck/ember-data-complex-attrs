import {module, test} from 'ember-qunit';
import attr from '@rigo/ember-data-complex-attrs/attr';
import ComplexAttr from '@rigo/ember-data-complex-attrs/models/complex-attrs/complex-attr';

module('Unit | attr');

test('can specify default value', function (assert) {
  assert.expect(1);

  const FooComplexAttr = ComplexAttr.extend({
    bar: attr('string', {defaultValue: 'baz'})
  });

  const foo = FooComplexAttr.create();

  assert.strictEqual(foo.get('bar'), 'baz');
});

test('can get/set value', function (assert) {
  assert.expect(1);

  const FooComplexAttr = ComplexAttr.extend({
    bar: attr('string', {defaultValue: 'baz'})
  });

  const foo = FooComplexAttr.create();

  foo.set('bar', 'baz');

  assert.strictEqual(foo.get('bar'), 'baz');
});
