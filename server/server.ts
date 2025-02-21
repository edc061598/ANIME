/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';
import jwt from 'jsonwebtoken';
import { nextTick } from 'process';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.get('/api/anime', async (req, res, next) => {
  try {
    const sql = `
  select *
  from "shows"
  order by "rating" desc
  `;
    const result = await db.query(sql);
    const animeShows = result.rows;
    res.status(200).json(animeShows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/anime/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `
    select *
    from "shows"
    where "showId" = $1;
    `;
    const params = [id];
    const result = await db.query(sql, params);
    const animeShowId = result.rows[0];
    res.status(200).json(animeShowId);
  } catch(err){
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */

app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
