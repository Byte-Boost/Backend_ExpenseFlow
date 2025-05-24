const { User, Project } = require("../models");
const service = require("../services/account.services.js");


class requestHandler {
  // POST
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

  subscribeToProjects = async (req, res) => {
    const { body, user } = req;

    if (!user.id || !body.projectIds) {
      return res.status(400).send();
    }

    // Subscribe user to project
    User.findByPk(user.id)
      .then((user) => {
        if (!user) return res.status(404).json({ message: "User not found." });

        Project.findAll({ where: { id: body.projectIds } })
        .then((projects) => {
          let message = null
          if (projects.length !== body.projectIds.length && projects.length > 0) {
            message = "Some projects have not been found, and have been ignored.";
          }

          return user.addProjects(projects).then(() => {
            res.status(200).send({ message: message || "User subscribed to projects" });
          });
        }).catch((err) => {
          console.log(err);
          res.status(400).send({ message: "Error subscribing user to projects" });
        });
        
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });

  };

  unsubscribeFromProjects = async (req, res) => {
    const { body, user } = req;

    if (!user.id || !body.projectIds) {
      return res.status(400).send();
    }

    // Subscribe user to project
    User.findByPk(user.id)
      .then((user) => {
        if (!user) return res.status(404).json({ message: "User not found." });

        Project.findAll({ where: { id: body.projectIds } })
        .then((projects) => {
          let message = null
          if (projects.length !== body.projectIds.length && projects.length > 0) {
            message = "Some projects have not been found, and have been ignored.";
          }

          return user.removeProjects(projects).then(() => {
            res.status(200).send({ message: message || "User unsubscribed from projects" });
          });
        }).catch((err) => {
          console.log(err);
          res.status(400).send({ message: "Error unsubscribing user from projects" });
        });
        
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });

  };

  // GET
  getUsers = async (req, res) => {
    const { user } = req;

    if (!user.id) {
      return res.status(400).send();
    }

    User.findAll({
      attributes: ['id', 'email'],
      order: [['id', 'ASC']],
      include: [
        {
          model: Project,
          attributes: ['id', 'name'],
          through: {
            attributes: []
          }
        }
      ] 
    }).then((users) => {
      res.status(200).send(users);
    }).catch((err)=>{
      console.log(err);
      res.status(400).send({ message: "Error getting users" });
    })
  };
}

module.exports = new requestHandler();
