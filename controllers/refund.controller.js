const { Refund } = require("../models");
const { Op } = require("sequelize");
class requestHandler {
  // POST
  requestRefund = (req, res) => {
    let { body } = req;
    let attachmentPath = "" // Path got from the file upload middleware
    let refund = {
      userId: 1, //req.user.id, when authentication middleware is implemented
      type: body.type,
      value: body.value,
      date: new Date(),
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

    // check for authorization

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

  // GET
  getRefunds = (req, res) => {
    let { query } = req;
    
    let TIMEZONE_OFFSET = query.timezone ? parseInt(query.timezone) : -3;
    let page = query.page ? parseInt(query.page) : 1;
    let limit = query.limit ? parseInt(query.limit) : 50;
    console.log( TIMEZONE_OFFSET)
    let filter = {
      where: {
        // userId: req.user.id,
      },
      offset: (page - 1) * limit,
      limit: limit
    }

    if (query.periodStart) {
      let startDate = new Date(query.periodStart);
      startDate.setUTCMinutes(startDate.getMinutes() - TIMEZONE_OFFSET * 60);
      filter.where.date = { [Op.gte]: startDate };
    } 
    if (query.periodEnd) {
      let endDate = new Date(query.periodEnd);
      endDate.setUTCHours(23, 59, 59, 999);
      endDate.setUTCMinutes(endDate.getMinutes() - TIMEZONE_OFFSET * 60); 
      filter.where.date = filter.where.date || {}; 
      filter.where.date[Op.lte] = endDate;
    }

    Refund.findAll(filter).then((response) => {
        res.status(200).send(response);
    }).catch((err) => {
        console.log(err);
        res.status(400).send();
    });
  }

  getRefundById = (req, res) => {
    let { params } = req;
    Refund.findOne({
      where: {
        // userId: req.user.id,
        id: params.id
      }
    }).then((response) => {
      res.status(200).send(response);
    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  }

}

module.exports = new requestHandler();
