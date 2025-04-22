const { Project } = require('../models');
const ProjectPreferences = require('../models/mongodb/project.preference.js');
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
        }).then(async (project) => {

            if (!project) return res.status(404).send({ message: "Project not found" });
            
            ProjectPreferences.findOne({ projectId: project.id }).then((preferences)=>{
                if (preferences) {
                    project.dataValues.preferences = {
                        colorTheme: preferences.colorTheme,
                        managerName: preferences.managerName,
                        priceLimit: preferences.priceLimit,
                        qtyPricePerUnit: preferences.qtyPricePerUnit
                    };
                } else project.dataValues.preferences = null;
                res.status(200).send(project);
            }).catch((err)=>{
                console.log(err);
                res.status(400).send();
            });

        }).catch((err) => {
            console.log(err);
            res.status(400).send();
        })
    }
}

module.exports = new requestHandler();
