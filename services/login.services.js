const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class loginService {

    getHashed = async (password) => {
        const salt = await bcrypt.genSalt()  //create a random salt that goes before the password, like eUsFhiYouPassword
        const hashed = await bcrypt.hash(password, salt)  //Hash the password using the salt, is hashing like this password => eusfhiYouPassword
        return hashed
    }
    
    compareHash = async (password, hash) => {
        return await bcrypt.compare(password,hash)
    }

    getToken = async (user) => {
        const token = jwt.sign({ "id" : user.id, "username" : user.username}, process.env.JWT_SECRET);
        return token;
    }
    login = async (user, password)=>{
        const passwordMatches = await this.compareHash(password, user.password);
        if(passwordMatches) return this.getToken(user);
        else throw new Error("Usuário ou senha inválidos");
    }
}

module.exports = new loginService();

