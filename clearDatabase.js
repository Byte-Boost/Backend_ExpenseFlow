const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, "./userdata/receipt"); 
const db = require('./models');

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

async function clearMongoDB() {
  const mongoose = require("mongoose"); 
  const mongoUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`; 
  await mongoose.connect(mongoUri);
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}

async function clearDatabaseAndFiles(){
  await deleteUploads();
  console.log("\nCached files deleted\n");

  await db.sequelize.sync({force: true});
  console.log("\nMySQL Database synced\n");

  await clearMongoDB();
  console.log("\nMongoDB cleared\n");
}

module.exports = clearDatabaseAndFiles;