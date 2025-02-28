/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';
import jwt from 'jsonwebtoken';
import { nextTick } from 'process';
import { markAsUntransferable } from 'worker_threads';

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
  ;`;
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

app.post('/api/favorites/:userId', async(req, res, next) => {
  try {
    const {showId} = req.body;
    const userId = req.params.userId;
    if (
      Number.isNaN(userId) ||
      !Number.isInteger(+userId) ||
      Number(userId) < 1
    ) {
      throw new ClientError(400, 'Invalid userId.');
    }
    if (
      Number.isNaN(showId) ||
      !Number.isInteger(+showId) ||
      Number(showId) < 1
    ) {
      throw new ClientError(400, 'Invalid showId.');
    }
    const sql = `
    insert into "favorites" ("showId", "userId")
    values($1, $2)
    returning *;
    `;
    const params = [showId, userId];
    const result = await db.query(sql, params);
    const favorites = result.rows[0];
    res.status(200).json(favorites);
  } catch(err){
    next(err);
  }
});

app.get('/api/favorites/:userId', async(req, res, next) => {
  try {
    const { userId } = req.params;
    const sql = `
    select "favorites".*,shows.title, shows.description, shows.image, shows.rating
     from "favorites"
     join "shows" on favorites."showId" = shows."showId"
     where favorites."userId" = $1;
     `;
     const params = [userId];
     const result = await db.query(sql, params);
     res.status(200).json(result.rows);
  } catch(err){
    next(err);
  }
});

app.get('/api/favorites', async(req, res, next) => {
  try {
    const sql = `
    select * from "favorites"
    returning *
    ;`;
    const result = await db.query(sql);
    const favoriteShows = result.rows;
    res.status(200).json(favoriteShows);
  } catch(err){
    next(err);
  }
})

app.get('/api/all-shows', async(req, res, next) => {
  try {
    const sql = `
    select * from "shows"
    order by "showId"
    ;`;
    const result = await db.query(sql);
    const allShows = result.rows;
    res.status(200).json(allShows);
  } catch(err){
    next(err);
  }
});

app.post('/api/reviews', async(req, res, next) => {
  try {
    const {userId, showId, reviewText, rating} = req.body;
    const sql = `
    insert into "reviews" ("userId", "showId", "reviewText", "rating")
    values ($1, $2, $3, $4)
    returning *;
    `;
    const params = [userId, showId, reviewText, rating];
    const result = await db.query(sql, params);
    const reviewShows = result.rows[0];
    res.status(201).json(reviewShows);
  } catch(err){
    next(err);
  }
});

app.get('/api/reviews/:showId', async (req, res, next) => {
  try {
    const { showId } = req.params;
    const sql = `
      SELECT r.*, u."userName"
      FROM "reviews" r
      JOIN "users" u ON r."userId" = u."userId"
      WHERE r."showId" = $1
      ORDER BY r."createdAt" DESC;
    `;
    const params = [showId];
    const result = await db.query(sql, params);
    res.status(200).json(result.rows);
  } catch (err) {
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
