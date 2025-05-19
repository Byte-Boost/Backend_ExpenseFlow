const { Refund } = require("../models");
const { Expense } = require("../models");
const { Project } = require("../models");
const { User } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");

class requestHandler {
  // POST
  createRefund = (req, res) => {
    let { params, user } = req;

    Project.findByPk(params.projectId)
      .then((project) => {
        let refund = {
          projectId: project.id,
          userId: user.id,
        };

        Refund.create(refund)
          .then((response) => {
            res.status(201).send({ refundId: response.id });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send();
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ error: "Project not found" });
      });
  };
  createExpense = async (req, res) => {
    let { body } = req;
    try {
      const refundExists = await Refund.findByPk(body.refundId);
      if (!refundExists) {
        if (body.file) {
          fs.unlink(body.file, (err) => {
            if (err) console.error("Failed to delete file:", err);
          });
        }
        console.log("Refund not found:", body.refundId);
        return res.status(400).send({ error: "Invalid refundId" });
      }

      let expense = {
        userId: req.user.id,
        refundId: body.refundId,
        type: body.type,
        quantityType: body.quantityType || null,
        value: body.value,
        date: new Date(),
        attachmentRef: body.file,
        description: body.description || null,
      };

      Expense.create(expense).then((response) => {
        res.status(201).send({ expenseId: response.id });
      });
    } catch (err) {
      if (body.file) {
        fs.unlink(body.file, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }
      console.error("Error creating expense:", err);
      return res.status(400).send({ error: "Failed to create expense" });
    }
  };

  // PATCH
  closeRefund = (req, res) => {
    let { params } = req;
    Refund.findOne({
      where: {
        id: params.id,
      },
    })
      .then((response) => {
        if (response != null && response.status == "new") {
          Refund.update(
            { date: new Date(), status: "in-process" },
            { where: { id: response.id } }
          )
            .then(() => {
              res.status(200).send();
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send({ error: "Error closing refund" });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  };
  authRefund = (req, res) => {
    let { params } = req;
    let { query } = req;

    // check for authorization
    Refund.findOne({
      where: {
        id: params.id,
      },
    })
      .then((response) => {
        if (response != null && response.status == "in-process") {
          Refund.update(
            {
              status: query.approved === "true" ? "approved" : "rejected",
            },
            {
              where: {
                id: response.id,
              },
            }
          )
            .then((response) => {
              res.status(200).send();
            })
            .catch((err) => {
              console.log(err);
              res.status(400).send({ err: "Invalid request" });
            });
        } else {
          console.log("Refund non-existent or not in-process");
          res.status(400).send({ err: "invalid request" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  };

  // GET
  getRefunds = (req, res) => {
    let { user, query } = req;

    let TIMEZONE_OFFSET = query.timezone ? parseInt(query.timezone) : -3;
    let page = query.page ? parseInt(query.page) : 1;
    let limit = query.limit ? parseInt(query.limit) : 50;
    let projectId = query.projectId ? query.projectId : null;

    let filter = {
      where: {
        status: { [Op.ne]: "new" },
        userId: user.admin ? {[Op.ne]: null} : req.user.id,
        projectId: projectId ? projectId : {[Op.ne]: null}
      },
      offset: (page - 1) * limit,
      limit: limit,
      include: [
        {
          model: Expense,
          attributes: ["id", "date", "type", "value"],
        },
        {
          model: User,
          attributes: ["id", "email"],
        }
      ],
    };

    if (query.status) {
      const statusList = query.status.split(",").map((s) => s.trim());
      filter.where.status[Op.in] = statusList;
    }

    if (query.projectId) {
      filter.where.projectId = query.projectId;
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

    Refund.findAll(filter)
      .then((refunds) => {
        const refundsWithTotal = refunds.map((refund) => {
          const totalValue = refund.Expenses.reduce(
            (sum, expense) => sum + expense.value,
            0
          );
          return {
            ...refund.toJSON(),
            totalValue,
          };
        });
        res.status(200).send(refundsWithTotal);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  };
  getRefundById = (req, res) => {
    let { user, params } = req;
    Refund.findOne({
      where: {
        userId: user.admin ? {[Op.ne]: null} : req.user.id,
        id: params.id,
      }, include: [
        {
          model: Expense,
          attributes: ["id", "value"],
        },
        {
          model: User,
          attributes: ["id", "email"],
        },
        {
          model: Project,
          attributes: ["id", "name"],
        }
      ]
    })
      .then((refund) => {
        const totalValue = refund.Expenses.reduce(
          (sum, expense) => sum + expense.value,
          0
        );
        const refundWithTotal = {
            ...refund.toJSON(),
            totalValue,
          }
        res.status(200).send(refundWithTotal);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  };
  getExpenseById = (req, res) => {
    let { user, params } = req;
    Expense.findOne({
      where: {
        userId: user.admin ? {[Op.ne]: null} : req.user.id,
        id: params.id,
      },
    })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  };

  // DELETE
  deleteRefund = (req, res) => {
    const { params, user } = req;

    Refund.findOne({
      where: {
        id: params.id,
        userId: user.id,
      },
    })
      .then((refund) => {
        if (!refund) {
          return res.status(404).send({ message: "Refund not found" });
        }

        if (refund.status !== "new") {
          return res
            .status(403)
            .send({ message: "Cannot delete a refund that is not new" });
        }

        return refund.destroy().then(() => {
          res.status(204).send();
        });
      })
      .catch((err) => {
        console.error("Error deleting refund:", err);
        res.status(500).send({ message: "Error deleting refund" });
      });
  };
}

module.exports = new requestHandler();
