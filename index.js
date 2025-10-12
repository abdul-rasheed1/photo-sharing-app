import express from 'express';
import {usersRouter} from './src/routes/user-route.js';
import {postRouter} from './src/routes/post-route.js';
import {likeRouter} from './src/routes/like-route.js';
import {commentRouter} from './src/routes/comment-route.js';


const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', usersRouter);
app.use('/posts', postRouter);
app.use('/like', likeRouter);
app.use('/comment', commentRouter);





app.listen(port , ()=>{
	console.log(`Server is running  on http://localhost:${port}`);
})