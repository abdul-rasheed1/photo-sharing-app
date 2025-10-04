import {pool} from '../db/db.js';

export const signUp = async(username, hashedPassword, email) =>{
	 const query = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id`;
	 const result = await pool.query(query, [username,hashedPassword,email]);
	 //console.log(result.rows);
	 return result.rows[0];

}

export const findUser = async(cred) =>{
	const query = `SELECT id, username, password FROM users WHERE username = $1 OR email = $2`;
	const result = await pool.query(query,[cred,cred]);
	console.log(result.rows);
	return result.rows;
} 

export const sendToken = async(user_id, token)=>{
	const query = 'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)';
	const result = await pool.query(query,[user_id,token]);
	console.log(result.rowCount);
	return result.rowCount;
}

export const tokenCheck = async(user_id,token)=>{
	const query = 'SELECT * FROM refresh_tokens WHERE user_id= $1 AND token = $2';
	const result = await pool.query(query,[user_id, token]);
	return result.rows;
}


export const deleteToken = async(user_id,token)=>{
	const query = 'DELETE FROM refresh_tokens WHERE user_id= $1 AND token = $2';
	const result = await pool.query(query,[user_id, token]);
	return result.rowCount;
}