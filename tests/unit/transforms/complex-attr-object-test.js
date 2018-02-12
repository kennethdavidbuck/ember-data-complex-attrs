import {moduleFor, test} from 'ember-qunit';

import BaseComplexAttr, {attr} from 'ember-data-complex-attrs/models/complex-attrs/base';
import {typeOf} from '@ember/utils';
import {run} from '@ember/runloop';

const FooComplexAttr = BaseComplexAttr.extend({
  payout: attr('number'),
  rank: attr('number'),
  riderId: attr('string'),
  riderDisplayName: attr('string'),
  participantId: attr('string'),
  nestedComplexAttr: attr('complex-attr-object', {type: 'bar'})
});

const BarComplexAttr = BaseComplexAttr.extend({
  someProperty: attr('string')
});

moduleFor('transform:complex-attr-object', 'Unit | Transform | complex attr', {
  beforeEach() {
    this.register('model:complex-attrs/foo', FooComplexAttr);
    this.register('model:complex-attrs/bar', BarComplexAttr);
  }
});

test('#deserialize works', function (assert) {
  assert.expect(9);

  let transform = this.subject();

  const serialized = {
    id: 'abc-123',
    rank: '100',
    payout: '1000',
    'rider-display-name': 'Jim Bob',
    'participant-id': 1,
    'nested-complex-attr': {
      id: 'dfd-ksjdfs',
      'some-property': 'some value'
    }
  };

  let deserialized;

  run(() => {
    deserialized = transform.deserialize(serialized, {type: 'foo'});
  });

  assert.ok(deserialized instanceof FooComplexAttr, 'should be an instance of the correct complex attr');

  assert.strictEqual(deserialized.get('riderDisplayName'), 'Jim Bob', 'rider display name should be deserialized');
  assert.strictEqual(deserialized.get('participantId'), '1', 'participant id should be deserialized and of correct type');
  assert.strictEqual(deserialized.get('id'), 'abc-123', 'id should be deserialized');
  assert.strictEqual(deserialized.get('rank'), 100, 'rank should be deserialized and of correct type');
  assert.strictEqual(deserialized.get('payout'), 1000, 'payout should be deserialized and of correct type');

  // deserialized nested complex attrs
  assert.ok(deserialized.get('nestedComplexAttr') instanceof BarComplexAttr, 'it allows nesting of other complex attrs');
  assert.strictEqual(deserialized.get('nestedComplexAttr.id'), 'dfd-ksjdfs', 'next complex attr has the correct id');
  assert.strictEqual(deserialized.get('nestedComplexAttr.someProperty'), 'some value', 'should have correct value');
});

test('#serialize works', function (assert) {
  assert.expect(7);

  let transform = this.subject();

  const deserialized = FooComplexAttr.create({
    payout: 300,
    rank: 1,
    riderDisplayName: 'Jim Bob',
    participantId: 1,
    nestedComplexAttr: FooComplexAttr.create({
      id: 'nested-id',
      someProperty: 'some value'
    })
  });

  let serialized;

  run(() => {
    serialized = transform.serialize(deserialized, {type: 'foo'});
  });

  assert.strictEqual(serialized['rider-display-name'], 'Jim Bob', 'rider name should be serialized');
  assert.strictEqual(serialized['participant-id'], '1', 'participant id should be serialized');
  assert.strictEqual(typeOf(serialized['id']), 'string', 'should have an auto-generated id');
  assert.strictEqual(serialized['rank'], 1, 'rank should be serialized');
  assert.strictEqual(serialized['payout'], 300, 'payout should be serialized');

  // serialized nested complex attrs
  assert.strictEqual(serialized['nested-complex-attr']['id'], 'nested-id', 'nested id should be serialized');
  assert.strictEqual(serialized['nested-complex-attr']['some-property'], 'some value', 'nested property should be serialized');
});

test('#keyForType works', function (assert) {
  assert.expect(1);

  let transform = this.subject();

  assert.strictEqual(transform.keyForType('cars'), 'model:complex-attrs/car');
});
