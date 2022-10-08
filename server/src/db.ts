import pg from 'pg';
const { Pool } = pg;

// interface Query {
//   text: string,
//   values?: (string | number | boolean)[],
//   rowMode?: string
// }
type queryParam = number | string | boolean;
// console.log('creating pool');
const pool = new Pool();
pool.on('error', (err) => {
  console.error('Error:', err);
});

export default {
  query: async (text: string, values?: queryParam[]) => {
    return pool.query(text, values);
  }
};
