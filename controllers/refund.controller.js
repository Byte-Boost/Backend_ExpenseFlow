const { Refund } = require("../models");
const { Expense } = require("../models");
const { Op } = require("sequelize");
class requestHandler {
  // POST 
  createRefund = (req, res) => {
    let refund = {
      userId: req.user.id,
    }
    
    Refund.create(refund).then((response)=>{
      res.status(201).send({refundId: response.id});
    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  };
  createExpense = (req, res) => {
    let { body } = req;
    let attachmentPath = "" // Path got from the file upload middleware
    
    let expense = {
      userId: req.user.id, 
      refundId: body.refundId,
      type: body.type,
      value: body.value,
      date: new Date(),
      attachmentRef: attachmentPath,
      description: body.description || null,
    }
    
    Expense.create(expense).then((response)=>{
      res.status(201).send({expenseId: response.id});
    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  };

  // PATCH
  closeRefund = (req, res) => {
    let { params } = req;
    Refund.findOne({
      where: {
        id: params.id
      }
    }).then((response) => {
      if (response != null && response.status == "new"){
        Refund.update({ date: new Date(), status: "in-process" }, { where: { id: response.id } })
        .then(()=>{
            res.status(200).send();
        }).catch ((error)=>{
          console.error(error);
          res.status(500).send({ error: "Error closing refund" });
        }) 
      }
    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  }
  authRefund = (req, res) => {
    let { params } = req;
    let { query } = req;

    // check for authorization
    Refund.findOne({
      where: {
        id: params.id
      }
    }).then((response) => {

      if (response != null && response.status == "in-process"){
        Refund.update({
          status: query.approved === "true" ? "approved" : "rejected"
        }, {
          where: 
          {
            id: response.id
          }
        }).then((response) => {
          res.status(200).send();
        }).catch((err) => {
          console.log(err);
          res.status(400).send({err: "Invalid request"});
        })
      } else {
        console.log("Refund non-existent or not in-process");
        res.status(400).send({err: "invalid request"})
      }

    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  }

  // GET
  getRefunds = (req, res) => {
    let { query } = req;
    
    let TIMEZONE_OFFSET = query.timezone ? parseInt(query.timezone) : -3;
    let page = query.page ? parseInt(query.page) : 1;
    let limit = query.limit ? parseInt(query.limit) : 50;

    let filter = {
      where: {
        userId: req.user.id,
      },
      offset: (page - 1) * limit,
      limit: limit,
      include: [
        {
          model: Expense,
          attributes: ["id", "date", "type", "value"], // Only fetch these fields
        },
      ]
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
        userId: req.user.id,
        id: params.id
      }
    }).then((response) => {
      res.status(200).send(response);
    }).catch((err) => {
      console.log(err);
      res.status(400).send();
    });
  }
  getExpenseById = (req, res) => {
    let { params } = req;
    Expense.findOne({
      where: {
        userId: req.user.id,
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
