const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const db = require('./models');
const cors = require('cors');

app.use(cors());

app.use(express.json())

app.use('/refund', require('./routes/refund.routes'));
// app.use('/template', require('./routes/template.routes'));

db.sequelize.sync().then(()=>{
  app.listen(PORT, ()=>console.log(`Server running on https://localhost:${PORT}`));
});