const userController = require("./../Controller/user-controller");
const tokenController = require("./../Controller/token-controller");
module.exports = (app) =>{
    const passport = require('passport')

    app.route('/api/users/auth/signup').post(userController.signup)
    app.route('/api/users/auth/signin').post(userController.singin)
    app.route('/api/users/auth/logout').get(userController.logout)
    app.route('/api/checkToken').get(tokenController.checkToken)
}
