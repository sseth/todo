import pg from 'pg';
const { Pool } = pg;

const pool = new Pool();

export default {
  query: (text: string, params: (string | number | boolean)[]) =>
    pool.query(text, params),
};
