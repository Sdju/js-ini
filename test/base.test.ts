import { describe, it, expect } from 'vitest';
import {
  parse,
  stringify,
  $Proto,
  $Errors,
  ParsingError,
} from '../src';
import type { IIniObjectSection } from '../src';

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

const ini3 = `v1=2
v-2=true
v 3=string

[smbd]
v1=5
v2=what
v5=who is who = who

[test scope with spaces]
mgm*1=2.5`;

const ini4 = `v1: 2
v-2: true
v 3: string
[smbd]
v1: 5
v2: what
v5: who is who = who
[test scope with spaces]
mgm*1: 2.5`;

const ini5 = `v1: 2
v-2: true
v 3: string
[smbd]
v5: who is who = who
v2: what
v1: 5
[test scope with data]
b1c,wdwd,15:68
wx/w':wwdlw,:d,wld
efkeofk`;

const ini6 = `
[ __proto__  ]
polluted = "polluted"`;

const ini7 = `
[scope with trash]
ok = value
trash

[scope with only trash]
only trash

[empty scope]
[normal scope]
ok = value
`;

const ini8 = `
[section]
isTrue = true
IsTrue = TRUE
isFalse = false
IsFalse = FALSE
is5 = 5
is5.3 = 5.3
isIp = 128.0.0.1
is0 = 0
isNaN = NaN
isNULL = null
isHex = 0xFf0066
isUndefined =
`;

const ini9 = `v1 : 2
v-2:true
v 3 : string
[smbd]
v1:5
v2 : what
#comment
;other comment
v5 : who is who = who

[test scope with spaces]
mgm*1  : 2.5`;

const ini10 = `
[exports]
NEW!=NOVO!
Press Start For Options=Aperte &START; de novo para opções
Start To Join=Aperte &START; para entrar
Entering Options=Entrando no menu de opções...
HelpText=&BACK; Sair  &START; Selecionar / Entrar &MENULEFT;&MENURIGHT; Mover :: &MENUUP;&MENUUP;/&MENUDOWN;&MENUDOWN; Mudar dificuldade   &SELECT; (hold) Atalhos
AlternateHelpText=&SELECT;+&MENULEFT;&MENURIGHT; Mudar dificuldade &SELECT;+&START; Mudar ordenação
HeaderSubText=
SortLabel=Filtro
SpeedLabel=Velocidade
LengthLabel=Duração
StageLabel=Estágio
LongSong=Música Longa
MarathonSong=Maratona
ChartStats=Chart Info
NoAuthor=N/A
HighScore=Pontuação Alta
ChangeDifficulty=&MENULEFT;&MENURIGHT; Mudar dificuldade
ChangeSort=&START; Mudar ordenação`;

const ini11 = `
value = 1
value = 2
value = 3
second = 1
second = 2
another = 1

[test]
value = 1
value = 2
value = 3
second = 1
second = 2
another = 1`;

const v1 = {
  v1: 2,
  'v-2': true,
  'v 3': 'string',
  smbd: {
    v1: 5,
    v2: 'what',
    v5: 'who is who = who',
  },
  'test scope with spaces': {
    'mgm*1': 2.5,
  },
};
const v2 = {
  v1: '2',
  'v-2': 'true',
  'v 3': 'string',
  smbd: {
    v1: '5',
    v2: 'what',
    v5: 'who is who = who',
  },
  'test scope with spaces': {
    'mgm*1': '2.5',
  },
};
const v3 = {
  v1: '2',
  'v-2': 'true',
  'v 3': 'string',
  smbd: {
    v1: '5',
    v2: 'what',
    v5: 'who is who = who',
  },
  'test scope with data': [
    'mfkl;wemfvvlkj;sdafn bv',
    'qpo[weiktjkgtjgiqewrjgoepqrg',
    'qwlfp-[weklfpowek,mf',
  ],
};

describe('base js-ini test', () => {
  it('ini parsing', () => {
    expect(parse(ini1)).toEqual(v1);

    expect(parse(ini2, { comment: '#', delimiter: ':' })).toEqual(v1);

    expect(parse(ini9, { comment: ['#', ';'], delimiter: ':' })).toEqual(v1);

    expect(parse(ini2, { comment: '#', delimiter: ':', autoTyping: false })).toEqual(v2);

    expect(parse(ini5, { delimiter: ':', dataSections: ['test scope with data'] }))
      .toEqual({
        v1: 2,
        'v-2': true,
        'v 3': 'string',
        smbd: {
          v1: 5,
          v2: 'what',
          v5: 'who is who = who',
        },
        'test scope with data': [
          'b1c,wdwd,15:68',
          'wx/w\':wwdlw,:d,wld',
          'efkeofk',
        ],
      });
  });

  it('ini stringify', () => {
    expect(stringify(v1)).toBe(ini3);

    expect(stringify(v1, {
      blankLine: false,
      delimiter: ':',
      spaceAfter: true,
      spaceBefore: false,
    })).toBe(ini4);

    expect(() => {
      stringify({
        a: 5,
        b: 3,
        c: {
          d: 8,
          e: 9,
        },
        f: {
          g: 'init',
          h: {
            msg: 'nesting',
          },
        },
      });
    }).toThrow();

    expect(parse(stringify(v3), {
      dataSections: ['test scope with data'],
      autoTyping: false,
    })).toEqual(v3);
  });

  it('ini parsing: proto', () => {
    expect(() => parse(ini6))
      .toThrow('Unsupported section name "__proto__": [2]"');

    expect(parse(ini6, { protoSymbol: true }))
      .toEqual({
        [$Proto]: {
          polluted: '"polluted"',
        },
      });
  });

  it('ini parsing: errors', () => {
    expect(() => parse(ini7))
      .toThrow('Unsupported type of line: [4] "trash"');

    expect(parse(ini7, { nothrow: true }))
      .toEqual({
        'scope with trash': {
          ok: 'value',
        },
        'scope with only trash': {},
        'empty scope': {},
        'normal scope': {
          ok: 'value',
        },
        [$Errors]: [
          new ParsingError('trash', 4),
          new ParsingError('only trash', 7),
        ],
      });
  });

  it('ini parsing: autotype', () => {
    expect(parse(ini8, { nothrow: true, autoTyping: true }))
      .toEqual({
        section: {
          isTrue: true,
          IsTrue: true,
          isFalse: false,
          IsFalse: false,
          isHex: 0xFf0066,
          is5: 5,
          'is5.3': 5.3,
          isIp: '128.0.0.1',
          is0: 0,
          isNaN: NaN,
          isNULL: null,
          isUndefined: undefined,
        },
      });
  });

  it('ini stringify: infinity fix test', () => {
    const result = parse(ini10);
    stringify(result);

    expect(stringify(result)).toEqual(ini10);
  });

  it('ini parsing: merge strategies', () => {
    expect(parse(ini11)).toEqual({
      value: 3,
      second: 2,
      another: 1,
      test: {
        value: 3,
        second: 2,
        another: 1,
      },
    });

    const result = parse(ini11, { keyMergeStrategy: 'join-to-array' });
    expect(result, 'join-to-array failed').toEqual({
      value: [1, 2, 3],
      second: [1, 2],
      another: 1,
      test: {
        value: [1, 2, 3],
        second: [1, 2],
        another: 1,
      },
    });

    const customMergeStrategy = (section: IIniObjectSection, name: string, val: any) => {
      // eslint-disable-next-line no-param-reassign
      section[name] = name in section ? `${section[name]}|${val.toString()}` : val.toString();
    };
    const result2 = parse(ini11, { keyMergeStrategy: customMergeStrategy });
    expect(result2, 'custom merge failed').toEqual({
      value: '1|2|3',
      second: '1|2',
      another: '1',
      test: {
        value: '1|2|3',
        second: '1|2',
        another: '1',
      },
    });
  });
});
