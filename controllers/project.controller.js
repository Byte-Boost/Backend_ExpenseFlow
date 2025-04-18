const { Project } = require('../models');
const fs = require("fs");

class requestHandler {
    //POST
    createProject = (req, res) => {
        let { body } = req;
        let project = {
            name: body.name,
        }

        Project.create(project).then((response) => {
            res.status(201).send({projectId: response.id});
        }).catch((err) => {
            console.log(err);
            res.status(400).send();
        });
    };

    // GET
    getProjects = (req, res) => {
        let { query } = req;

        let page = query.page ? parseInt(query.page) : 1;
        let limit = query.page ? parseInt(query.limit) : 50;

        let filter = {
            offset: (page - 1) * limit,
            limit: limit,
        }

        Project.findAll(filter).then((projects) => {
            res.status(200).send(projects);
        }).catch((err) => {
            console.log(err);
            res.status(400).send();
        });
    }
    getProjectById = (req, res) => {
        let { params } = req;
        Project.findOne({
            where: {
                id: params.id
            }
        }).then((response) => {
            res.status(200).send(response);
        }).catch((err) => {
            console.log(err);
            res.status(400).send();
        })
    }
}

module.exports = new requestHandler();
