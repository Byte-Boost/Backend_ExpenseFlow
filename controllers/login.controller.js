const loginServices = require("../services/login.services")

class requestHandler {
  // POST
  requestLogin = async (req, res) => {
    //Login method
    const { username, password } = req.body;

    if( !username || !password ) {
      return res.status(400).json({ message: "Forneça o usuário e senha"})
    }

    try {
      const token = await loginServices.login(username, password);

      return res.status(200).json({token});
    }
    catch (err) {
      return res.status(401).json({ message: Error.message});
    }
    
  };
}

module.exports = new requestHandler();
