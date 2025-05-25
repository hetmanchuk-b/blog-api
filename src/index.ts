import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import categoriesRouter from './routes/categories';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';

dotenv.config();

const app: Express = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Blog APO is running')
})

app.use('/categories', categoriesRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));