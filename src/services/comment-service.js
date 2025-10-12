import {pool} from '../db/db.js'

export const createComment = async(post_id,user_id, text) =>{
	const query = `INSERT INTO comments (post_id,user_id,comment) VALUES ($1, $2, $3)`;
	const result = await pool.query(query, [post_id, user_id, text]);
	return result.rowCount;
} 


export const getComments = async(post_id) =>{
const query = `SELECT c.id,c.comment,c.comment_at, u.username
				FROM comments c
				JOIN users u ON c.user_id = u.id
				WHERE post_id = $1
				ORDER BY c.comment_at DESC`;

const result = await pool.query(query,[post_id]);
return result.rows;
}