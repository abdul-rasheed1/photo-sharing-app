import express from 'express';
import {fileToCloud, urlToDb, postToDb, getAllPosts,delPost, userPosts} from '../services/post-service.js';
import {upload} from '../middleware/multerMiddleware.js';
import {jwtCheck} from '../middleware/authMiddleware.js';

export const postRouter = express.Router();

postRouter.post('/createPost', jwtCheck,upload.single('photo'), async(req,res)=>{
	try{
		const userId = req.user.id;
		const {caption} = req.body;
		let imageUrl = null;
		if (!req.file && !caption){
			return res.status(400).json({message:"Post must contain either an image or a caption"});
			}

			if(req.file){
				const uploadResult = await fileToCloud(req.file.buffer, userId);
				imageUrl = uploadResult.secure_url;
			}

			const postDb = await postToDb(userId, caption);

			if(imageUrl !== null){
				await urlToDb(imageUrl, postDb.post_id);
			} 

			return res.status(201).json({message:"post created"});


	}catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal Server Error"});
	}

}) ;






postRouter.get('/', jwtCheck, async(req,res)=>{
	try{
		const allPosts = await getAllPosts();
		return res.status(200).json({message:"all posts retrieved successfully", posts:allPosts});

	}
	catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal Server Error"});
	}
});







postRouter.delete('/deletePost/:id', jwtCheck, async(req,res)=>{
	try{
		const {id:post_id} = req.params;
		const {id:userId} = req.user;
		const del = await delPost(post_id,userId);

		if(del.rowCount === 0){
			return res.status(404).json({message:"post not found"});
		}

		return res.status(204).json({message:"Delete Successfull", postId:del.rows[0].post_id});


	}
	catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal Server Error"});
	}
});


postRouter.get('/myposts', jwtCheck, async(req,res)=>{
	try{
	const userId = req.user.id;
	const posts = await userPosts(userId);
	return res.status(200).json({message:"posts retrieved", myPosts:posts});

	}
	catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal Server Error"});
	}

});











