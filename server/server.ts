/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg, { Client } from 'pg';
import { ClientError, errorMiddleware,authMiddleware } from './lib/index.js';
import jwt from 'jsonwebtoken';
import { nextTick } from 'process';
import { markAsUntransferable } from 'worker_threads';
import argon2 from 'argon2';


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

app.put('/api/reviews/:reviewId', async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { reviewText, rating } = req.body;
    const sql = `
      UPDATE "reviews"
      SET "reviewText" = $1, "rating" = $2
      WHERE "reviewId" = $3
      RETURNING *;
    `;
    const params = [reviewText, rating, reviewId];
    const result = await db.query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
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

app.put('/api/reviews/:reviewId', async(req, res, next) => {
  try{
    const { reviewId } = req.params;
    const {reviewText, rating} = req.body;
    const sql = `
     update "reviews"
     set "reviewText" = $1, "rating" = $2
     where "reviewId" = $3
     returning * ;
     `;
     const params = [reviewText, rating, reviewId];
     const result = await db.query(sql, params);
     if(!result){
      console.log(`${result} not found`);
     }
     res.status(200).json(result.rows[0]);
  } catch(err){
    next(err);
  }
})

app.get('/api/favorites/:userId', async (req, res, next) => {
  try  {
    const { userId } = req.params;
    const sql = `
    select favorites."favoritesText", favorites."rating", favorites."showId"
    shows."title", shows."description", shows."image"
    from "favorites"
    join "shows" on favorites."showId" = shows."showsId"
    where favorites."userId" = $1;
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const favoriteShows = result.rows[0];
    res.status(200).json(favoriteShows);
  } catch(err){
    next(err);
  }
});

app.post('/api/favorites', async (req, res, next) => {
  try {
    const { userId, showId } = req.body;
    if (!userId || !showId) {
      throw new ClientError(400, 'userId and showId required');
    }
    const sql = `
      INSERT INTO "favorites" ("userId", "showId")
      VALUES ($1, $2)
      RETURNING *;
    `;
    const params = [userId, showId];
    const result = await db.query(sql, params);
    const favoriteShow = result.rows[0];
    res.status(201).json(favoriteShow);
  } catch (err) {
    next(err);
  }
});

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
}

type Auth = {
  userName:string;
  password: string;
}

const hashkey = process.env.TOKEN_SECRET;
if (!hashkey) throw new Error ('TOKEN_SECRET  not found in .env');

app.post('/api/auth/sign-up', async (req, res, next) => {
  try{
    const { userName, password} = req.body;
    if(!userName || !password){
      throw new ClientError(400, 'userName and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
    insert into "users" ("userName", "passwordHash")
    values ($1, $2)
    returning "userName", "userId";
    `;
    const body = [userName, hashedPassword];
    const result = await db.query(sql, body);
    const userResult = result.rows[0];
    if(!userResult){
      throw new ClientError(404, 'user not found');
    }

    return res.status(201).json(userResult);
  } catch(err){
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { userName, password } = req.body as Partial<Auth>;
    if(!userName || !password){
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
    "passwordHash"
    from "users"
    where "userName" = $1;
    `;
    const result = await db.query(sql, [userName]);
    const user = result.rows[0];
    if(!user){
      throw new ClientError(401, 'user not found');
    }
    const passwordMatch = await argon2.verify(user.passwordHash, password);
    if(!passwordMatch) {
      throw new ClientError(401, 'password is not found');
    }
    const payload = {
      userId: user.userId,
      username: user.username,
    }
    const signedToken = jwt.sign(payload, hashkey);
    return res.status(200).json({payload, signedToken});

  } catch(err){
    next(err);
  }
});

app.delete('/api/favorites/:userId/:showId', async (req, res, next) => {
  try {
    const { userId, showId } = req.params;
    const sql = `
      DELETE FROM "favorites"
      WHERE "userId" = $1 AND "showId" = $2
      RETURNING *;
    `;
    const params = [userId, showId];
    const result = await db.query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.status(200).json(result.rows[0]);
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
