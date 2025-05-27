const clearDatabaseAndFiles = require('./clearDatabase');
const generateDummyData = require('./generateDummyData');

async function startDummy() {
  await clearDatabaseAndFiles();
  await generateDummyData();
  require('./index');
}

startDummy();