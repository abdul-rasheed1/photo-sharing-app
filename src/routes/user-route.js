import express from 'express';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import {signUp,findUser} from '../services/user_service.js';
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import {jwtCheck} from '../middleware/authMiddleware.js';


export const usersRouter = express.Router();

usersRouter.post('/signup', async(req,res)=>{
	try{
	const {username, password, email} = req.body;
	if (!username || !password || !email){
		res.status(400).json({error: "Username, Password and email are required"});
	}
	if(password.length < 6 ){
		res.status(400).json({error:"Password must be at least 6 characters long"});
	}
	if(!validator.isEmail(email)){
		res.status(400).json({error:'provide a valid email address'});
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const signedUp = await signUp(username, hashedPassword, email);
	//console.log(signedUp);

	return res.status(201).json({message:`user created successfully`, userid: signedUp.id});

	}
catch(e){
	console.error(e);
	return res.status(500).json({error:"Internal Server Error"});
}

})


usersRouter.post('/login', async(req,res)=>{
	try{
		const{username, password} = req.body;
		const user = await findUser(username);
		if(user.length === 0){
			console.log("username or email not found");
			return res.status(400).json({message: 'Invalid request data'});
		}
		const passwordCheck = await bcrypt.compare(password, user[0].password);

		if(!passwordCheck){
			console.log('Invalid credentials');
			return res.status(400).json({message:'Invalid Credentials'});
		}

		console.log('Login successfull');
		const token = jwt.sign({id:user[0].id}, process.env.JWT_SECRETE,{expiresIn:'1hr'});
		console.log(token);

		return res.status(200).json({message:'Login successfull', jwt:token});



	}catch(e){
		console.error(e);
		return res.status(500).json({message:'Internal Server Error'});
	}
});



usersRouter.post('/logout', async(req,res)=>{
	res.status(200).json({message:'logged out succesfully'});
});


usersRouter.get('/protected',jwtCheck, (req,res)=>{
	res.status(200).json({message: 'Access granted' , userId: req.user});

})




