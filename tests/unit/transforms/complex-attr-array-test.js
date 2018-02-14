import {moduleFor, test} from 'ember-qunit';
import {A} from '@ember/array';
import {typeOf} from '@ember/utils';
import {run} from '@ember/runloop';

import ComplexAttr from '@rigo/ember-data-complex-attrs/models/complex-attrs/complex-attr';
import attr from '@rigo/ember-data-complex-attrs/attr';

const FooComplexAttr = ComplexAttr.extend({
  payout: attr('number'),
  rank: attr('number'),
  riderId: attr('string'),
  riderDisplayName: attr('string'),
  participantId: attr('string')
});

moduleFor('transform:complex-attr-array', 'Unit | Transform | complex-attr-array', {
  beforeEach() {
    this.register('model:complex-attrs/foo', FooComplexAttr);
  }
});

test('it exists', function (assert) {
  let transform = this.subject();
  assert.ok(transform);
});

test('#deserialize handles blank serialized value', function (assert) {
  let transform = this.subject();

  assert.deepEqual(transform.deserialize(undefined, {type: 'foo'}), undefined);
});

test('#deserialize works', function (assert) {
  assert.expect(18);

  let transform = this.subject();

  let serialized = [
    {
      id: 'abc-123',
      rank: null,
      payout: null,
      'rider-display-name': 'Jim Bob',
      'participant-id': 1
    },
    {
      id: '123-abc',
      rank: '1',
      payout: '5000',
      'rider-display-name': 'Bob Jim',
      'participant-id': 2
    },
    {
      id: 'foo-bar-baz',
      rank: 1,
      payout: 1000,
      'rider-display-name': 'Bob Hope',
      'participant-id': 3
    }
  ];

  let deserialized;

  run(() => {
    deserialized = transform.deserialize(serialized, {type: 'foo'});
  });

  assert.ok(deserialized.objectAt(0) instanceof FooComplexAttr, 'should be an instance of the correct complex attr');
  assert.ok(deserialized.objectAt(1) instanceof FooComplexAttr, 'should be an instance of the correct complex attr');
  assert.ok(deserialized.objectAt(2) instanceof FooComplexAttr, 'should be an instance of the correct complex attr');

  assert.strictEqual(deserialized.objectAt(0).get('riderDisplayName'), 'Jim Bob', 'rider display name should be deserialized');
  assert.strictEqual(deserialized.objectAt(1).get('riderDisplayName'), 'Bob Jim', 'rider display name should be deserialized');
  assert.strictEqual(deserialized.objectAt(2).get('riderDisplayName'), 'Bob Hope', 'rider display name should be deserialized');

  assert.strictEqual(deserialized.objectAt(0).get('participantId'), '1', 'participant id should be deserialized and of correct type');
  assert.strictEqual(deserialized.objectAt(1).get('participantId'), '2', 'participant id should be deserialized and of correct type');
  assert.strictEqual(deserialized.objectAt(2).get('participantId'), '3', 'participant id should be deserialized and of correct type');

  assert.strictEqual(deserialized.objectAt(0).get('id'), 'abc-123', 'id should be deserialized');
  assert.strictEqual(deserialized.objectAt(1).get('id'), '123-abc', 'id should be deserialized');
  assert.strictEqual(deserialized.objectAt(2).get('id'), 'foo-bar-baz', 'id should be deserialized');

  assert.strictEqual(deserialized.objectAt(0).get('rank'), null, 'rank should be deserialized and of correct type');
  assert.strictEqual(deserialized.objectAt(1).get('rank'), 1, 'rank should be deserialized and of correct type');
  assert.strictEqual(deserialized.objectAt(2).get('rank'), 1, 'rank should be deserialized and of correct type');

  assert.strictEqual(deserialized.objectAt(0).get('payout'), null, 'payout should be deserialized and of correct type');
  assert.strictEqual(deserialized.objectAt(1).get('payout'), 5000, 'payout should be deserialized and of correct type');
  assert.strictEqual(deserialized.objectAt(2).get('payout'), 1000, 'payout should be deserialized and of correct type');
});

test('#serialize handles blank deserialized value', function (assert) {
  assert.expect(1);

  let transform = this.subject();

  assert.deepEqual(transform.serialize(undefined, {type: 'foo'}), undefined);
});

test('#serialize works', function (assert) {
  assert.expect(15);

  let transform = this.subject();

  const model1 = FooComplexAttr.create({
    payout: '300',
    rank: '1',
    riderDisplayName: 'Jim Bob',
    participantId: '1'
  });

  const model2 = FooComplexAttr.create({
    payout: '200',
    rank: '2',
    riderDisplayName: 'Bob Jim',
    participantId: '2'
  });

  const model3 = FooComplexAttr.create({
    payout: '100',
    rank: '3',
    riderDisplayName: 'Bob Hope',
    participantId: '3'
  });

  let serialized;

  run(() => {
    serialized = transform.serialize(A([model1, model2, model3]), { type: 'foo'});
  });

  assert.strictEqual(serialized[0]['rider-display-name'], 'Jim Bob', 'rider name should be serialized');
  assert.strictEqual(serialized[1]['rider-display-name'], 'Bob Jim', 'rider name should be serialized');
  assert.strictEqual(serialized[2]['rider-display-name'], 'Bob Hope', 'rider name should be serialized');

  assert.strictEqual(serialized[0]['participant-id'], '1', 'participant id should be serialized');
  assert.strictEqual(serialized[1]['participant-id'], '2', 'participant id should be serialized');
  assert.strictEqual(serialized[2]['participant-id'], '3', 'participant id should be serialized');

  assert.strictEqual(typeOf(serialized[0]['id']), 'string', 'should have an auto-generated id');
  assert.strictEqual(typeOf(serialized[1]['id']), 'string', 'should have an auto-generated id');
  assert.strictEqual(typeOf(serialized[2]['id']), 'string', 'should have an auto-generated id');

  assert.strictEqual(serialized[0]['rank'], 1, 'rank should be serialized');
  assert.strictEqual(serialized[1]['rank'], 2, 'rank should be serialized');
  assert.strictEqual(serialized[2]['rank'], 3, 'rank should be serialized');

  assert.strictEqual(serialized[0]['payout'], 300, 'payout should be serialized');
  assert.strictEqual(serialized[1]['payout'], 200, 'payout should be serialized');
  assert.strictEqual(serialized[2]['payout'], 100, 'payout should be serialized');
});
