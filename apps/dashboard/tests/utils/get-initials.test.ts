import { describe, expect, it } from 'vitest';

import { getInitials } from '../../src/utils/get-initials';

describe('getInitials', () => {
  it('returns the first letter of the first and last names', () => {
    expect(getInitials('Eduardo Fonseca')).toBe('EF');
  });

  it('ignores middle names', () => {
    expect(getInitials('Eduardo Mauricio Fonseca')).toBe('EF');
  });

  it('returns a single letter for a single name', () => {
    expect(getInitials('Eduardo')).toBe('E');
  });

  it('uppercases the initials', () => {
    expect(getInitials('ana souza')).toBe('AS');
  });

  it('ignores extra spaces', () => {
    expect(getInitials('  Ana   Souza  ')).toBe('AS');
  });

  it('returns an empty string for an empty name', () => {
    expect(getInitials('   ')).toBe('');
  });
});
