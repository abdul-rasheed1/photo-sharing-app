import {pool} from './src/db/db.js';
import {readdirSync, readFileSync} from 'fs';


const runMigration = async()=>{
	const client = await pool.connect();
	try{
		console.log(`Starting migration process...`);

		const migrationFiles = readdirSync('./migrations').sort();
		migrationFiles.shift();
		//console.log(migrationFiles);

		const migrationDb = await client.query('SELECT name FROM migration ORDER BY name'); 
		const appliedmigrationDb = migrationDb.rows.map(file => file.name );
		//console.log(appliedmigrationDb);

		const newMigrations = migrationFiles.filter(file => !appliedmigrationDb.includes(file));
		//console.log(newMigrations)

		if (newMigrations.length === 0){
			console.log(`No new migration to apply`);
			return;
		} 
		console.log(`Applying ${newMigrations.length} new migration(s)...`);
		for (const file of newMigrations){
			console.log(`Applying new migration ${file}`);
			const sql = readFileSync(`./migrations/${file}`, 'utf-8');

			await client.query(sql, (err,res)=>{
				if(!err){
					console.log(res.command);
				}
			});
			await client.query(`INSERT INTO migration (name) VALUES ($1)`, [file]);

			console.log(`migration completed successfully`);
		}



		}catch(e){
			console.error('An error occured', e);

		}
		finally{
			client.release();
		}
}

runMigration();