import Mixin from '@ember/object/mixin';
import attr from '@rigo/ember-data-complex-attrs/attr'
import {uuid} from 'ember-cli-uuid';

export default Mixin.create({
  id: attr('string', {
    defaultValue: () => uuid(),
    copyable: false
  })
});
