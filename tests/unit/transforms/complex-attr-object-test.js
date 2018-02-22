import {moduleFor, test} from 'ember-qunit';
import ComplexAttr from '@rigo/ember-data-complex-attrs/models/complex-attrs/complex-attr';
import attr from '@rigo/ember-data-complex-attrs/attr';
import {run} from '@ember/runloop';

const FooComplexAttr = ComplexAttr.extend({
  payout: attr('number'),
  rank: attr('number'),
  riderId: attr('string'),
  riderDisplayName: attr('string'),
  participantId: attr('string'),
  nestedComplexAttr: attr('complex-attr-object', {type: 'bar'})
});

const BarComplexAttr = ComplexAttr.extend({
  someProperty: attr('string'),
  nestedComplexAttr: attr('complex-attr-object', {type: 'bar'})
});

moduleFor('transform:complex-attr-object', 'Unit | Transform | complex attr object', {
  beforeEach() {
    this.register('model:complex-attrs/foo', FooComplexAttr);
    this.register('model:complex-attrs/bar', BarComplexAttr);
  }
});

test('#deserialize handles blank serialized value', function (assert) {
  let transform = this.subject();

  assert.equal(transform.deserialize(undefined, {type: 'foo'}), undefined);
});

test('#deserialize works', function (assert) {
  assert.expect(9);

  let transform = this.subject();

  const serialized = {
    rank: '100',
    payout: '1000',
    'rider-display-name': 'Jim Bob',
    'participant-id': 1,
    'nested-complex-attr': {
      'some-property': 'some value',
      'nested-complex-attr': {
        'some-property': 'another value'
      }
    }
  };

  let deserialized;

  run(() => {
    deserialized = transform.deserialize(serialized, {type: 'foo'});
  });

  assert.ok(deserialized instanceof FooComplexAttr, 'should be an instance of the correct complex attr');

  assert.strictEqual(deserialized.get('riderDisplayName'), 'Jim Bob', 'rider display name should be deserialized');
  assert.strictEqual(deserialized.get('participantId'), '1', 'participant id should be deserialized and of correct type');
  assert.strictEqual(deserialized.get('rank'), 100, 'rank should be deserialized and of correct type');
  assert.strictEqual(deserialized.get('payout'), 1000, 'payout should be deserialized and of correct type');

  // deserialized nested complex attrs
  const singleNestedComplexAttr = deserialized.get('nestedComplexAttr');
  assert.ok(singleNestedComplexAttr instanceof BarComplexAttr, 'it allows nesting of other complex attrs');
  assert.strictEqual(singleNestedComplexAttr.get('someProperty'), 'some value', 'should have correct value');

  // second level nesting
  const doubleNestedComplexAttr = singleNestedComplexAttr.get('nestedComplexAttr');
  assert.ok(doubleNestedComplexAttr instanceof BarComplexAttr, 'should be an instance of the correct complex attr');
  assert.strictEqual(doubleNestedComplexAttr.get('someProperty'), 'another value');
});

test('#serialize works', function (assert) {
  assert.expect(6);

  let transform = this.subject();

  const deserialized = FooComplexAttr.create({
    payout: 300,
    rank: 1,
    riderDisplayName: 'Jim Bob',
    participantId: 1,
    nestedComplexAttr: FooComplexAttr.create({
      someProperty: 'some value',
      nestedComplexAttr: BarComplexAttr.create({
        someProperty: 'another value'
      })
    })
  });

  let serialized;

  run(() => {
    serialized = transform.serialize(deserialized, {type: 'foo'});
  });

  assert.strictEqual(serialized['rider-display-name'], 'Jim Bob', 'rider name should be serialized');
  assert.strictEqual(serialized['participant-id'], '1', 'participant id should be serialized');
  assert.strictEqual(serialized['rank'], 1, 'rank should be serialized');
  assert.strictEqual(serialized['payout'], 300, 'payout should be serialized');

  // serialized nested complex attrs
  const singleNestedComplexAttr = serialized['nested-complex-attr'];
  assert.strictEqual(singleNestedComplexAttr['some-property'], 'some value', 'nested property should be serialized');

  // second level nesting
  const doubleNestedComplexAttr = singleNestedComplexAttr['nested-complex-attr'];
  assert.strictEqual(doubleNestedComplexAttr['some-property'], 'another value');
});
