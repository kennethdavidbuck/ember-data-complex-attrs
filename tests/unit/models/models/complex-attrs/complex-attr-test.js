import {module, test} from 'ember-qunit';
import ComplexAttr from '@rigo/ember-data-complex-attrs/models/complex-attrs/complex-attr';
import attr from '@rigo/ember-data-complex-attrs/attr';
import {copy} from '@ember/object/internals';

let NestableComplexAttr = ComplexAttr.extend({
  foo: attr('string')
});

let SomeComplexAttr = ComplexAttr.extend({
  foo: attr('string'),
  bar: attr('number'),
  baz: attr(),
  nestedComplexAttr: attr('complex-attr-object', {
    type: 'nestable-complex-attr'
  })
});

module('Unit | Model | models/complex attrs/complex attr', {
  needs: []
});

test('it exists', function (assert) {
  let model =  ComplexAttr.create();

  assert.ok(!!model);
});

test('implements copyable (shallow)', function (assert) {
  assert.expect(7);

  let nestedComplexAttr = NestableComplexAttr.create({
    foo: 'bar'
  });

  let someComplexAttr = SomeComplexAttr.create({
    foo: 'abc',
    bar: 123,
    baz: [],
    nestedComplexAttr
  });

  const copiedComplexAttr = copy(someComplexAttr);

  assert.ok(copiedComplexAttr instanceof SomeComplexAttr, 'clone should be of correct type');
  assert.notEqual(copiedComplexAttr, someComplexAttr, 'clone should be a new instance');

  assert.strictEqual(someComplexAttr.get('id'), copiedComplexAttr.get('id'), 'should copy id');
  assert.strictEqual(someComplexAttr.get('foo'), copiedComplexAttr.get('foo'));
  assert.strictEqual(someComplexAttr.get('bar'), copiedComplexAttr.get('bar'));
  assert.equal(someComplexAttr.get('baz'), copiedComplexAttr.get('baz'), 'should not deep copy array');
  assert.equal(someComplexAttr.get('nestedComplexAttr'), copiedComplexAttr.get('nestedComplexAttr'), 'should not copy nested complex attr');
});

test('implements copyable (deep)', function (assert) {
  assert.expect(8);

  let nestedComplexAttr = NestableComplexAttr.create({
    foo: 'bar'
  });

  let someComplexAttr = SomeComplexAttr.create({
    foo: 'abc',
    bar: 123,
    baz: [],
    nestedComplexAttr
  });

  const copiedComplexAttr = copy(someComplexAttr, true);

  assert.ok(copiedComplexAttr instanceof SomeComplexAttr, 'clone should be of correct type');
  assert.notEqual(copiedComplexAttr, someComplexAttr, 'clone should be a new instance');

  assert.strictEqual(someComplexAttr.get('id'), copiedComplexAttr.get('id'), 'should copy id');
  assert.strictEqual(someComplexAttr.get('foo'), copiedComplexAttr.get('foo'));
  assert.strictEqual(someComplexAttr.get('bar'), copiedComplexAttr.get('bar'));
  assert.notEqual(someComplexAttr.get('baz'), copiedComplexAttr.get('baz'), 'should be a deep copy array');
  assert.notEqual(someComplexAttr.get('nestedComplexAttr'), copiedComplexAttr.get('nestedComplexAttr'), 'should be a deep copy nested complex attr');

  assert.strictEqual(someComplexAttr.get('nestedComplexAttr.foo'), copiedComplexAttr.get('nestedComplexAttr.foo'), 'should copy nested properties')
});
