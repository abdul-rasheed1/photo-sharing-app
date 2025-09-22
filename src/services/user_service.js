import {pool} from '../db/db.js';

export const signUp = async(username, hashedPassword, email) =>{
	 const query = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id`;
	 const result = await pool.query(query, [username,hashedPassword,email]);
	 console.log(result.rows);
	 return result.rows[0];

}

export const findUser = async(cred) =>{
	const query = `SELECT id, username, password FROM users WHERE username = $1 OR email = $2`;
	const result = await pool.query(query,[cred,cred]);
	console.log(result.rows);
	return result.rows;
} 