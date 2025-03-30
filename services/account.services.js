const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class accountService {

    getHashed = async (password) => {
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(password, salt)
        return hashed
    }
    
    compareHash = async (password, hash) => {
        return await bcrypt.compare(password,hash)
    }

    getToken = async (user) => {
        const token = jwt.sign({ "id" : user.id, "email" : user.email}, process.env.JWT_SECRET);
        return token;
    }
    login = async (user, password)=>{
        const passwordMatches = await this.compareHash(password, user.password);
        if(passwordMatches) return this.getToken(user);
        else throw new Error("Invalid password or email");
    }
}

module.exports = new accountService();