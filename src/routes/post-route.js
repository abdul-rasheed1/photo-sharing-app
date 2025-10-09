import express from 'express';
import {fileToCloud, urlToDb, postToDb, getAllPosts} from '../services/post-service.js';
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

}) 

postRouter.get('/', jwtCheck, async(req,res)=>{
	try{
		const allPosts = await getAllPosts();
		return res.status(200).json({message:"all posts retrieved successfully", posts:allPosts});

	}
	catch(e){
		console.error(e);
		return res.status(500).json({message:"Internal Server Error"});
	}
})
