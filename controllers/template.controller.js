const { Template } = require("../models");
class requestHandler {
  // POST
  createTemplate = (req, res) => {
    let { body } = req;
    let template = {
      name: body.name,
      description: body.description,
    }
    
    Template.create(template).then((response)=>{
      res.status(201).send();
    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  };
}

module.exports = new requestHandler();
