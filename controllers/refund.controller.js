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

  authRefund = (req, res) => {
    let { params } = req;
    let { query } = req;

    console.log(query.approved)
    console.log(params)

    Refund.update({
      status: query.approved === "true" ? "approved" : "rejected"
    }, {
      where: 
      {
        id: params.id
      }
    }).then((response) => {
      res.status(200).send();
    }).catch((err) => {
      console.log(err);
      res.status(400).send({err: "Invalid request"});
    })
  }
}

module.exports = new requestHandler();
