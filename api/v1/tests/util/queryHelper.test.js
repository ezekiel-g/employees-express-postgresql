import { describe, it, expect } from '@jest/globals';
import { formatInsert, formatUpdate } from '../../util/queryHelper.js';

describe('formatInsert', () => {
  it('formats request body for insert correctly', () => {
    const [columnNames, queryParams, placeholders] = formatInsert({
      name: 'Michael',
      city: 'New York',
    });

    expect(columnNames).toEqual(['name', 'city']);
    expect(queryParams).toEqual(['Michael','New York']);
    expect(placeholders).toBe('$1, $2');
  });

  it('returns empty values for empty input', () => {
    const [columnNames, queryParams, placeholders] = formatInsert({});

    expect(columnNames).toEqual([]);
    expect(queryParams).toEqual([]);
    expect(placeholders).toBe('');
  });
});

describe('formatUpdate', () => {
  it('formats request body for update correctly', () => {
    const [columnNames, setClause, queryParams] = formatUpdate(
      { id: 1, name: 'Michael', city: 'New York' },
      1,
    );

    expect(columnNames).toEqual(['name', 'city']);
    expect(setClause).toBe('name = $1, city = $2');
    expect(queryParams).toEqual(['Michael', 'New York', 1]);
  });

  it('returns empty values except id for input empty except id', () => {
    const [columnNames, setClause, queryParams] = formatUpdate(
      { id: 1 },
      1,
    );

    expect(columnNames).toEqual([]);
    expect(setClause).toBe('');
    expect(queryParams).toEqual([1]);
  });
});
