import {
  describe, it, expect, beforeAll, afterAll, afterEach,
} from 'vitest';
import { join } from 'path';
import { promises as fs } from 'fs';
import { readIniFile } from '../src/tools/read-ini-file';
import { writeIniFile } from '../src/tools/write-ini-file';

const ini1 = `v1 : 2
v-2:true
v 3 : string
[smbd]
v1:5
v2 : what
#comment
v5 : who is who = who

[test scope with spaces]
mgm*1  : 2.5`;

const ini2 = `v1: 2
v-2: true
v 3: string
[smbd]
v1: 5
v2: what
v5: who is who = who
[test scope with spaces]
mgm*1: 2.5`;

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

const basePath = join(__dirname, 'playground');
const iniPath = join(basePath, 'test.ini');
describe('base js-ini test', () => {
  beforeAll(async () => {
    await fs.mkdir(basePath);
  });

  afterAll(async () => {
    await fs.rmdir(basePath);
  });

  afterEach(async () => {
    const files = await fs.readdir(basePath);
    const promises = files.map((file: string) => fs.unlink(join(basePath, file)));
    await Promise.all(promises);
  });

  it('read-ini-file', async () => {
    await fs.writeFile(iniPath, ini1, 'utf-8');

    const iniObj = await readIniFile(iniPath, {
      comment: '#',
      delimiter: ':',
    });

    expect(iniObj).toEqual(v1);
  });

  it('write-ini-file', async () => {
    await writeIniFile(iniPath, v1, {
      blankLine: false,
      delimiter: ':',
      spaceAfter: true,
      spaceBefore: false,
    });

    const data = await fs.readFile(iniPath, 'utf-8');

    expect(data).toBe(ini2);
  });
});
