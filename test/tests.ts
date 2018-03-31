import { parse, stringify } from '../src';

const ini1 = `v1 = 2
v-2=true
v 3 = string
[smbd]
v1=5
v2 = what 
;comment
v5 = who is who = who

[test scope with spaces]
mgm*1  = 2.5`;
const ini2 = `v1 : 2
v-2:true
v 3 : string
[smbd]
v1:5
v2 : what 
#comment
v5 : who is who = who

[test scope with spaces]
mgm*1  : 2.5`;
const v1 = {
  v1: 2,
  ['v-2']: true,
  ['v 3']: 'string',
  smbd: {
    v1: 5,
    v2: 'what',
    v5: 'who is who = who',
  },
  ['test scope with spaces']: {
    ['mgm*1']: 2.5,
  },
};
const v2 = {
  v1: '2',
  ['v-2']: 'true',
  ['v 3']: 'string',
  smbd: {
    v1: '5',
    v2: 'what',
    v5: 'who is who = who',
  },
  ['test scope with spaces']: {
    ['mgm*1']: '2.5',
  },
};



test('ini parsing', () => {
  expect(parse(ini1)).toEqual(v1);

  expect(parse(ini2, { comment: '#', delimiter: ':' })).toEqual(v1);

  expect(parse(ini2, { comment: '#', delimiter: ':', autoTyping: false })).toEqual(v2);
});
