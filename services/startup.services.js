const { User } = require("../models/index.js");
const service = require("./account.services.js");

class startupService {
    async generateAdmin(){
        User.findAll({ where: { email: process.env.ADM_CREDENTIALS_EMAIL }, attributes: { exclude: ["password"]} })
            .then(async (users) => {
                if (users.length === 0) {
                    let admin = {
                        email: process.env.ADM_CREDENTIALS_EMAIL,
                        password: await service.getHashed(process.env.ADM_CREDENTIALS_PASSWORD),
                        admin: true
                    };
                    User.create(admin)
                        .then(() => {
                            console.log("Admin created successfully");
                        })
                        .catch((err) => {
                            console.log("Error creating admin: ", err);
                        });
                }
            })
            .catch((err) => {
                console.log("Error while finding admin: ", err);
            });
    }
}

module.exports = new startupService();