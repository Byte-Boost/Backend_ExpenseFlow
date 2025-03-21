const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const authMiddleware = require('./middleware/auth.middleware');
const db = require('./models');
const cors = require('cors');

app.use(cors());

app.use(express.json())

app.use('/user', require('./routes/user.routes'));
app.use(authMiddleware);
// app.use('/template', require('./routes/template.routes'));
app.use('/refund', require('./routes/refund.routes'));

db.sequelize.sync().then(()=>{
  app.listen(PORT, ()=>console.log(`Server running on https://localhost:${PORT}`));
});