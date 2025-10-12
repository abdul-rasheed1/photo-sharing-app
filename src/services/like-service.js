import {pool} from '../db/db.js';

export const checkForLike = async(post_id, user_id) =>{
	const query = 'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2';
	const result = await pool.query(query,[post_id,user_id]);
	return result.rowCount;
}


export const delLike = async(post_id, user_id) =>{
	const query = 'DELETE FROM likes WHERE post_id = $1 AND user_id = $2';
	const result = await pool.query(query,[post_id,user_id]);
	return result.rowCount;
}


export const createLike = async(post_id, user_id) =>{
	const query = 'INSERT INTO likes (post_id, user_id) VALUES ($1, $2)';
	const result = await pool.query(query, [post_id, user_id]);
	return result.rowCount;
}