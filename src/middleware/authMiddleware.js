import jwt from 'jsonwebtoken';
import'dotenv/config';

export const jwtCheck = (req,res,next) => {
	try{
		const authHeader  = req.headers.authorization; 
		console.log(`this is teh authheader: ${authHeader}`);

		if (!authHeader){
			return res.status(401).json({message:"authentication header missing"});
		}
		const token = authHeader.split(' ')[1];
		if(!token){
			return res.status(401).json({message:"Token not found"});
		}
		const verifyJwt = jwt.verify(token, process.env.JWT_SERCETE);

		req.user = verifyJwt;
		next();

	}catch(e){
		return res.status(401).json({message:"Invalid pr expired token"});
	}

}