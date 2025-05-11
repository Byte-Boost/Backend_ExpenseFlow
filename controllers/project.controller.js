const { Project, User } = require('../models');
const ProjectPreferences = require('../models/mongodb/project.preference.js');
const fs = require("fs");

class requestHandler {
    // POST
    createProject = (req, res) => {
        const { body } = req;
        let project = {
            name: body.name,
        }

        Project.create(project).then((project) => {
            let preferences = {
                projectId: project.id,
                refundLimit: 0,
                expenseLimit: 0,
                quantityValues: [],
            }
            if (body.preferences != null) {
                preferences = {
                    projectId: project.id,
                    refundLimit: body.preferences.refundLimit,
                    expenseLimit: body.preferences.expenseLimit,
                    quantityValues: body.preferences.quantityValues,
                };
            }
                
            ProjectPreferences.create(preferences).then((response) => {
                res.status(201).send({projectId: project.id});
            }).catch((err) => {
                console.log(err);
                res.status(201).send({projectId: project.id, warning: "Preferences not saved"});
            });

        }).catch((err) => {
            console.log(err);
            res.status(400).send();
        });
    };

    // GET
    getProjects = (req, res) => {
        const { query, user } = req;

        let page = query.page ? parseInt(query.page) : 1;
        let limit = query.page ? parseInt(query.limit) : 50;

        let filter = {
            offset: (page - 1) * limit,
            limit: limit,
            include: [
              {
                model: User,
                where: user.admin ? {} : { id: user.id },
                attributes: [],
                through: { attributes: [] },
              },
            ],
        }

        Project.findAll(filter).then((projects) => {
            res.status(200).send(projects);
        }).catch((err) => {
            console.log(err);
            res.status(400).send();
        });
    }
    getProjectById = (req, res) => {
        const { params } = req;
        Project.findOne({
            where: {
                id: params.id
            }
        }).then(async (project) => {

            if (!project) return res.status(404).send({ message: "Project not found" });
            
            ProjectPreferences.findOne({ projectId: project.id }).then((preferences)=>{
                if (preferences) {
                    project.dataValues.preferences = {
                        refundLimit: preferences.refundLimit,
                        expenseLimit: preferences.expenseLimit,
                        quantityValues: preferences.quantityValues,
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

    // DELETE
    deleteProject = (req, res) => {
        const { params } = req;
        Project.findOne({
            where: {
                id: params.id
            }
        }).then((project) => {
            if (!project) return res.status(404).send({ message: "Project not found" });
            ProjectPreferences.deleteOne({id: project.id}).then((response) => {
                project.destroy().then(() => {
                    res.status(204).send();
                }).catch(err=>{
                    console.log(err);
                    res.status(400).send();
                });
            })
        }).catch((err) => {
            console.log(err);
            res.status(400).send();
        })
    }
}

module.exports = new requestHandler();
