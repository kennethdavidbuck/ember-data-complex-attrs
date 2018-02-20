import {module, test} from 'ember-qunit';
import ComplexAttr from '@rigo/ember-data-complex-attrs/models/complex-attrs/complex-attr';
import attr from '@rigo/ember-data-complex-attrs/attr';
import {A} from '@ember/array'
import IdentifiableComplexAttrMixin from '@rigo/ember-data-complex-attrs/mixins/models/complex-attrs/identifiable';

let NestableComplexAttr = ComplexAttr.extend(IdentifiableComplexAttrMixin, {
  foo: attr('string')
});

let SomeComplexAttr = ComplexAttr.extend(IdentifiableComplexAttrMixin, {
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

  const copiedComplexAttr = someComplexAttr.copy();

  assert.ok(copiedComplexAttr instanceof SomeComplexAttr, 'clone should be of correct type');
  assert.notEqual(copiedComplexAttr, someComplexAttr, 'clone should be a new instance');

  assert.notEqual(someComplexAttr.get('id'), copiedComplexAttr.get('id'), 'should not copy id');
  assert.strictEqual(someComplexAttr.get('foo'), copiedComplexAttr.get('foo'));
  assert.strictEqual(someComplexAttr.get('bar'), copiedComplexAttr.get('bar'));
  assert.equal(someComplexAttr.get('baz'), copiedComplexAttr.get('baz'), 'should not deep copy array');

  const copiedNestedComplexAttr = copiedComplexAttr.get('nestedComplexAttr');

  assert.ok(copiedNestedComplexAttr instanceof NestableComplexAttr, 'clone should be of correct type');
  assert.equal(nestedComplexAttr, copiedNestedComplexAttr, 'should not deep copy nested complex attr');
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

  const copiedComplexAttr = someComplexAttr.copy(true);

  assert.ok(copiedComplexAttr instanceof SomeComplexAttr, 'clone should be of correct type');
  assert.notEqual(copiedComplexAttr, someComplexAttr, 'clone should be a new instance');

  assert.notEqual(someComplexAttr.get('id'), copiedComplexAttr.get('id'), 'should not copy id');
  assert.strictEqual(someComplexAttr.get('foo'), copiedComplexAttr.get('foo'));
  assert.strictEqual(someComplexAttr.get('bar'), copiedComplexAttr.get('bar'));
  assert.notEqual(someComplexAttr.get('baz'), copiedComplexAttr.get('baz'), 'should be a deep copy array');

  const copiedNestedComplexAttr = copiedComplexAttr.get('nestedComplexAttr');

  assert.notEqual(nestedComplexAttr, copiedNestedComplexAttr, 'should be a deep copy nested complex attr');
  assert.strictEqual(nestedComplexAttr.get('foo'), copiedNestedComplexAttr.get('foo'), 'should copy nested properties')
});

test('copies in array (shallow)', function (assert) {
  assert.expect(3);

  const array = [SomeComplexAttr.create({
    foo: 'abc'
  })];

  const arrayCopy = A(array).copy();

  assert.notEqual(array, arrayCopy, 'should be new array');
  assert.equal(A(array).get('firstObject'), A(arrayCopy).get('firstObject'), 'should be same instance still');
  assert.equal(array[0].get('id'), arrayCopy[0].get('id'), 'id should be the same (since this is a shallow array copy');
});

test('copies in array (deep)', function (assert) {
  assert.expect(4);

  const array = [SomeComplexAttr.create({
    foo: 'abc'
  })];

  const arrayCopy = A(array).copy(true);

  assert.notEqual(array, arrayCopy, 'should be new array');
  assert.notEqual(A(array).get('firstObject'), A(arrayCopy).get('firstObject'), 'should be a new instance');

  assert.equal(array[0].get('foo'), arrayCopy[0].get('foo'), 'foo property should have been copied');
  assert.notEqual(array[0].get('id'), arrayCopy[0].get('id'), 'id should not be copied');
});
