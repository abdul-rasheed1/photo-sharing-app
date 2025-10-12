import express from 'express';
import {jwtCheck} from '../middleware/authMiddleware.js';
import {checkForLike, delLike, createLike} from '../services/like-service.js';

export const likeRouter = express.Router();

likeRouter.post('/:postId', jwtCheck, async(req, res)=>{
	try{
		const post_id = req.params.postId;
		const user_id = req.user.id;

		const likeCheck = await checkForLike(post_id, user_id);
		 if (likeCheck > 0){
		 	const unlike = await delLike(post_id, user_id);
		 	
		 	return res.status(204).json({message:"post unliked"});
		 }
		 if(likeCheck === 0){
		 	const like = await createLike(post_id, user_id);
		 	return res.status(200).json({message:"post liked"});
		 }


	}
	catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal Server Error"});
	}
})