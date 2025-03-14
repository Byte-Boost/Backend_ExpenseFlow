const { Refund } = require("../models");
class requestHandler {
  // POST
  requestRefund = (req, res) => {
    let { body } = req;
    let attachmentPath = "" // Path got from the file upload middleware
    let refund = {
      type: body.type,
      value: body.value,
      attachmentRef: attachmentPath,
      description: body.description || null,
    }
    
    Refund.create(refund).then((response)=>{
      res.status(201).send();
    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  };
}

module.exports = new requestHandler();
