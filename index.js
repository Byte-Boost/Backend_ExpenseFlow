const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const db = require('./models');
const cors = require('cors');
const accountService = require('./services/account.services');
const accountServices = require('./services/account.services');

app.use(cors());

//i dont know what i doing
app.post( './login', async (req, res) => {
  const { username, password} = req.body;

  try {
    const token = await accountServices.login( username, password );
    res.json({ token });
  }
  catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }

});

app.use(express.json())

app.use('/refund', require('./routes/refund.routes'));
// app.use('/template', require('./routes/template.routes'));
app.use('/user', require('./routes/user.routes'));

db.sequelize.sync().then(()=>{
  app.listen(PORT, ()=>console.log(`Server running on https://localhost:${PORT}`));
});