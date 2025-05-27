const generateDummyData = require("../generateDummyData");

class requestHandler {

  // GET
  insertDummyData = async (req, res) => {
    try {
      await generateDummyData();
      res.status(201).send();
    } catch (err){
      console.log(err);
      res.status(500).send();
    }
  };
}

module.exports = new requestHandler();
