import { describe, expect, it } from 'vitest';
import { isAdultAttested } from '../shared/protocol';

describe('18+ confirmation', () => {
  it('accepts only an explicit true from the person joining', () => {
    expect(isAdultAttested({ name: 'A', adult: true })).toBe(true);
    for (const bad of [undefined, null, {}, { adult: 'true' }, { adult: 1 }, { adult: false }, 'adult'])
      expect(isAdultAttested(bad)).toBe(false);
  });
});
