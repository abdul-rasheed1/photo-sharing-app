import express from 'express';
import {usersRouter} from './src/routes/user-route.js';
import {postRouter} from './src/routes/post-route.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', usersRouter);
app.use('/posts', postRouter);





app.listen(port , ()=>{
	console.log(`Server is running  on http://localhost:${port}`);
})