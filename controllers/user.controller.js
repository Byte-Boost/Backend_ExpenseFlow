const { User } = require("../models");
const bcrypt = require("bcryptjs");


class requestHandler {
  // POST - Registrar usuário
  registerUser = async (req, res) => {
    try {
      const { email, username, password } = req.body;
      
      if (!email || !username || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
      });

      return res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao registrar o usuário." });
    }
  };
}

module.exports = new requestHandler();
