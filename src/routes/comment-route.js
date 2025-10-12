import express from 'express';
import {jwtCheck} from '../middleware/authMiddleware.js';
import {createComment, getComments} from '../services/comment-service.js';

export const commentRouter = express.Router();

commentRouter.post('/:postId', jwtCheck, async(req,res)=>{
	try{
		const post_id = req.params.postId;
		const user_id = req.user.id;
		const text = req.body.text;
		 if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: "Comment text is required." });
        }

		const comment = await createComment(post_id,user_id,text);
		return res.status(200).json({message:"comment added"});



	}
	catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal Server Error"});
	}
})


commentRouter.get('/:postId', jwtCheck, async(req, res)=>{
	try{
		const {postId} = req.params;
		const comments = await getComments(postId);

		return res.status(200).json({message:"comments retrieved", comments : comments});

	}
	catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal Server Error"});
	}
})