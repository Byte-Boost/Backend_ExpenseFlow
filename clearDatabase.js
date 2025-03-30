const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, "./userdata/receipt"); 
// This shouldn't be hard coded in but i don't want to mess with it right now.

async function deleteUploads(){
  if (!fs.existsSync(uploadDir)) return;
  
  fs.readdir( uploadDir , (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join( uploadDir , file), (err) => {
          if (err) throw err;
        });
      }
    });
}

const mysql = require("mysql2/promise");
mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}).then(async (connection) => {
  await connection.query(`DROP DATABASE ${process.env.DB_NAME};`);
  await connection.query(`CREATE DATABASE ${process.env.DB_NAME};`);
  await deleteUploads();
  await connection.end();
})
