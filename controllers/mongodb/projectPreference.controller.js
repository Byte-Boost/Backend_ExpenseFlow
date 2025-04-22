const ProjectPreferences = require('../../models/mongodb/project.preference.js');
class requestHandler {
    //Post
    createPreference = async (req, res) => {
        let preferences = {
            projectId: req.body.projectId,
            refundLimit: req.body.refundLimit,
            expenseLimit: req.body.expenseLimit,
            quantityValues: req.body.quantityValues,
        };
        
        ProjectPreferences.create(preferences).then((response)=>{
            res.status(201).json(response);
        }).catch ((err)=>{
            console.log(err);
            res.status(500).send('Error saving preferences');
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
}

module.exports = new requestHandler();