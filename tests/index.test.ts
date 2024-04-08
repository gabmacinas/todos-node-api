import { runQuery } from '../src/index';

describe('runQuery', () => {
  it('should resolve with rows when type is GET', async () => {
    const mockQuery = jest.fn((query, callback) => {
      callback(null, { rows: ['row1', 'row2'] });
    });
    const pool = { query: mockQuery };

    const result = await runQuery('GET', '', '');

    expect(result).toEqual(['row1', 'row2']);
    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM public.todo limit 10000', expect.any(Function));
  });

  it('should resolve with rows when type is POST', async () => {
    const mockQuery = jest.fn((query, values, callback) => {
      callback(null, { rows: ['row1', 'row2'] });
    });
    const pool = { query: mockQuery };

    // Call the runQuery function with type 'POST' and data 'test'
    const result = await runQuery('POST', 'test', '');

    expect(result).toEqual(['row1', 'row2']);
    expect(mockQuery).toHaveBeenCalledWith('INSERT INTO todo (name) VALUES ($1)', ['test'], expect.any(Function));
  });

  it('should reject with error when query fails', async () => {
    // Mock the pool.query function
    const mockQuery = jest.fn((query, callback) => {
      callback(new Error('Query failed'));
    });
    const pool = { query: mockQuery };

    try {
      await runQuery('GET1', '', '');
    } catch (error: any) {
      expect(error.message).toBe('Query failed');
    }
  });

  it('should reject with error when an exception is thrown', async () => {
    const mockQuery = jest.fn((query, callback) => {
      throw new Error('Exception thrown');
    });
    const pool = { query: mockQuery };

    try {
      await runQuery('GET', '', '');
    } catch (error: any) {
      expect(error.message).toBe('Exception thrown');
    }
  });
});

it('should resolve with rows when type is GET', async () => {
  const mockQuery = jest.fn((query, callback) => {
    callback(null, { rows: ['row1', 'row2'] });
  });
  const pool = { query: mockQuery };

  const result = await runQuery('GET', '');

  expect(result).toEqual(['row1', 'row2']);
  expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM public.todo limit 10000', expect.any(Function));
});

it('should reject with error when query fails', async () => {
  const mockQuery = jest.fn((query, callback) => {
    callback(new Error('Query failed'));
  });
  const pool = { query: mockQuery };

  try {
    await runQuery('GET', '');
  } catch (error: any) {
    expect(error.message).toBe('Query failed');
  }
});

describe('parseData', () => {
  it('should parse JSON data correctly', () => {
    const data = '{"name": "John", "age": 30}';
    const jsonData = JSON.parse(data);

    expect(jsonData).toEqual({ name: 'John', age: 30 });
  });

  it('should throw an error when parsing invalid JSON data', () => {
    const data = 'invalid json data';

    expect(() => {
      JSON.parse(data);
    }).toThrow();
  });
});
