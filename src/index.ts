// src/index.js
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
});

const isAuthenticated = (user: string) => {
  // TODO: omit this for now
  return true;
};

export function runQuery(type: string, data: string, id?: string) {
  return new Promise((resolve, reject) => {
    try {
      switch (type) {
        case 'GET':
          pool.query('SELECT * FROM public.todo limit 10000', (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log(res.rows);
              resolve(res.rows);
            }
          });
          break;
        case 'POST':
          pool.query('INSERT INTO todo (name) VALUES ($1)', [data], (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              resolve(res.rows);
            }
          });
          break;
        case 'DELETE':
          pool.query('DELETE FROM todo WHERE id = $1', [`${id}`], (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              resolve(res.rows);
            }
          });
          break;
        case 'PATCH':
          pool.query('UPDATE todo SET name = $1 WHERE id = $2', [`${data}`, `${id}`], (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              resolve(res.rows);
            }
          });
          break;
      }
    } catch (err: any) {
      console.log(err);
      reject(err);
    }
  });
}

app.get('/todos', async (req: Request, res: Response) => {
  if (!isAuthenticated) {
    res.status(401).send('Unauthorized');
    return;
  }
  const data = await runQuery('GET', '');
  res.send(data);
});

app.put('/todos', (req: Request, res: Response) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', async () => {
    const jsonData = JSON.parse(data);
    console.log(jsonData.name);
    if (!isAuthenticated) {
      res.status(401).send('Unauthorized');
      return;
    }

    if (!jsonData.name) {
      res.status(400).send('Bad Request');
      return;
    }
    try {
      await runQuery('POST', jsonData.name);
      res.send(await runQuery('GET', ''));
    } catch {
      res.status(500).send('Internal Server Error');
    }
  });
});

app.delete('/todos/:id', async (req: Request, res: Response) => {
  let id = req.params.id;
  if (!isAuthenticated) {
    res.status(401).send('Unauthorized');
    return;
  }
  if (!id) {
    res.status(400).send('Bad Request');
    return;
  }
  try {
    await runQuery('DELETE', '', id);
    res.send(await runQuery('GET', ''));
  } catch {
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/todos/:id', (req: Request, res: Response) => {
  let id = req.params.id;
  if (!isAuthenticated) {
    res.status(401).send('Unauthorized');
    return;
  }
  if (!id) {
    res.status(400).send('Bad Request');
    return;
  }
  try {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', async () => {
      const jsonData = JSON.parse(data);
      if (!jsonData.name) {
        res.status(400).send('Bad Request');
        return;
      }
      await runQuery('PATCH', jsonData.name, id);
      res.send(await runQuery('GET', ''));
    });
  } catch {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
