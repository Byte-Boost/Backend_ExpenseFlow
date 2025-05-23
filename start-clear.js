const clearDatabaseAndFiles = require('./clearDatabase');

async function startClear() {
  await clearDatabaseAndFiles();
  require('./index');
}

startClear();
