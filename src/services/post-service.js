import cloudinary from '../../config/cloudinaryConfig.js';
import {pool} from '../db/db.js';


export const fileToCloud = async(filebuffer, userId) => {
	return new Promise((resolve,reject) =>{
		cloudinary.uploader.upload_stream({
			folder:"social-pics",
			tags:[userId],
		},(err,res)=>{
			if(err){
				return reject(err)
			}
			resolve(res);
		}).end(filebuffer);

	});
};




export const urlToDb = async(url, id) =>{
const query = 'INSERT INTO photos (photo_url, post_id) VALUES ($1, $2) RETURNING *';
const result = await pool.query(query, [url, id]);
return result.rows;
}

export const postToDb = async(Id, caption) =>{
	const query = 'INSERT INTO posts (user_id, caption) VALUES ($1, $2) RETURNING post_id';
	const result = await pool.query(query, [Id, caption]);
	return result.rows[0];
}