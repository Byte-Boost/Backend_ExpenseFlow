const { User } = require("../models");
const service = require("../services/account.services.js");


class requestHandler {
  // POST - Registrar usuário
  registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }
    
    const user = {
      email,
      password: await service.getHashed(password),
    };

    // Create user
    User.create(user)
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
    });
  };
  loginUser = async (req, res) => {
    let { body } = req;

    const user = await User.findOne({ where: { email: body.email } });

    try {
      if (!user) throw new Error("Invalid password or email");
      const token = await service.login(user, body.password);
      res.status(200).json({ token: token });
    } catch (err) {
      res.status(401).send({error:err.message});
    }
  };
}

module.exports = new requestHandler();
