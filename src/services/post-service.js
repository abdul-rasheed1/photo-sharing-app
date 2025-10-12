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

export const getAllPosts = async() => { 
	const query = 	`SELECT p.post_id, p.caption, p.posted_at,u.username, m.photo_url, COUNT(DISTINCT l.like_id) AS likeCount, COUNT(DISTINCT c.id) AS commentCount
					FROM posts p 
					JOIN users u ON p.user_id = u.id 
					LEFT JOIN photos m ON p.post_id = m.post_id
					LEFT JOIN likes l ON p.post_id = l.post_id
					LEFT JOIN comments c ON p.post_id = c.post_id
					GROUP BY p.post_id, p.caption, p.posted_at, u.username, m.photo_url
					ORDER BY p.posted_at DESC
					LIMIT 10`;

	const result = await pool.query(query);
	return result.rows;


}

export const delPost = async(post_id,user_id) =>{
	const query = `DELETE FROM posts WHERE post_id = $1 AND user_id = $2 RETURNING post_id`;
	const result = await pool.query(query,[post_id,user_id]);
	return result;
}


export const userPosts = async(id) =>{
	const query = `SELECT p.post_id, p.caption, p.posted_at,u.username, m.photo_url, COUNT(DISTINCT l.like_id) AS likeCount, COUNT(DISTINCT c.id) AS commentCount
					FROM posts p 
					JOIN users u ON p.user_id = u.id 
					LEFT JOIN photos m ON p.post_id = m.post_id
					LEFT JOIN likes l ON p.post_id = l.post_id
					LEFT JOIN comments c ON p.post_id = c.post_id
					WHERE p.user_id = $1
					GROUP BY p.post_id, p.caption, p.posted_at, u.username, m.photo_url
					ORDER BY p.posted_at DESC`;
	const result = await pool.query(query, [id]);
	return result.rows;
}