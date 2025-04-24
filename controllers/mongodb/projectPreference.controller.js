const { Project } = require('../../models');
const ProjectPreferences = require('../../models/mongodb/project.preference.js');
class requestHandler {
    // POST
    createPreference = async (req, res) => {
        let project = await Project.findOne({ where: { id: req.body.projectId } });
        
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        let preferences = {
            projectId: project.id,
            refundLimit: req.body.refundLimit,
            expenseLimit: req.body.expenseLimit,
            quantityValues: req.body.quantityValues,
        };
        
        ProjectPreferences.create(preferences).then((response)=>{
            res.status(201).json(response);
        }).catch ((err)=>{
            console.log(err);
            res.status(500).send();
        })
    };

    // GET
    getAllPreferences = async (req, res) => {
        try {
            const preferences = await ProjectPreferences.find();
            res.status(200).json(preferences);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching preferences" });
        }
    }
    getPreferencesById = async (req, res) => {
        const { projectId } = req.params;
        try {
            const preference = await ProjectPreferences.findOne({ projectId });
            if (!preference) {
                return res.status(404).json({ message: "Preferences not found" });
            }
            res.status(200).json(preference);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching preferences" });
        }
    }

    // UPDATE
    updatePreferenceById = async (req, res) => {
        const { projectId } = req.params;
        try {
            const preference = await ProjectPreferences.findOne({ projectId });
            if (!preference) {
                return res.status(404).json({ message: "Preferences not found" });
            }
            await ProjectPreferences.updateOne({ projectId }, { $set: req.body });
            res.status(200).json({ message: "Preferences updated successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error updating preferences" });
        }
    }

}

module.exports = new requestHandler();