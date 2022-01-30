const response = require('./../response')
const db = require('./../db')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require("jsonwebtoken");
const validator = require("validator")


exports.signup = (req, res) => {

    db.query("SELECT * FROM users WHERE email = '" + req.body.email + "'", (error, rows, fields) => {
        const emailIsValid = validator.isEmail(req.body.email)
        const passwordLength = req.body.password.length
        if (error) {
            response.status(400, error, res)
        } else if (typeof rows !== 'undefined' && rows.length > 0) {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                response.status(250, {message: "Пользователь с данным email уже зарегистрирован"}, res)
                return true
            })
        } else if (!emailIsValid) {
            response.status(250, {message: "Введите корректный email"}, res)
        } else if (passwordLength < 8) {
            response.status(250, {message: "Длина пароля должна быть не менее 8 символов"}, res)
        } else {
            const sql = 'INSERT INTO users(email, password, token, refreshtoken) VALUES(?, ?, ?, ?)'
            const AccessToken = jwt.sign({
                email: req.body.email
            }, config.get('jwtKey'), {expiresIn: 14400})
            const RefreshToken = jwt.sign({
                email: req.body.email
            }, config.get('jwtKey'), {expiresIn: '30d'})
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(req.body.password, salt, config.get('bcriptStr'))
            const user = [req.body.email, hashedPassword, AccessToken, RefreshToken]

            db.query(sql, user, (error, results) => {
                if (error) {
                    response.status(400, error, res)
                } else {
                    response.status(201, {message: "Вы зарегистрированы!", results, AccessToken, RefreshToken}, res)
                }
            })
        }
    }).then(res =>{
        db.end()
    })
}
exports.singin = (req, res) => {
    db.query("SELECT id,email,password FROM users WHERE email = '" + req.body.email + "'", (error, rows, fields) => {
        if (error) {
            response.status(400, error, res)
        } else if (rows.length <= 0) {
            response.status(250, {message: 'Неверные данные для входа'}, res)
        } else {
            const row = JSON.parse(JSON.stringify(rows))
            row.map(rw => {
                const password = bcrypt.compareSync(req.body.password, rw.password)
                if (password) {
                    const AccessToken = jwt.sign({
                        userId: rw.id,
                        email: rw.email
                    }, config.get('jwtKey'), {expiresIn: 14400})
                    const RefreshToken = jwt.sign({
                        userId: rw.id,
                        email: rw.email
                    }, config.get('jwtKey'), {expiresIn: '30d'})
                    let updateTokenQuery = `UPDATE users SET token = "${AccessToken}", refreshtoken = "${RefreshToken}" WHERE email = "${rw.email}"`
                    db.query(updateTokenQuery, (error,result) =>{
                        if (error) {
                            response.status(400, error, res)
                        } else {
                            response.status(200, {message: 'Успешная авторизация!', AccessToken, RefreshToken}, res)
                        }
                    })

                } else {
                    response.status(250, {message: 'Неверные данные для входа'}, res)
                }

                return true
            })
        }
    }).then(res =>{
        db.end()
    })
}
exports.logout = (req,res) =>{
    const oldToken = req.headers.authorization
    db.query("SELECT * FROM users WHERE refreshtoken = '" + oldToken + "'", (error, rows, fields) => {
        if (error){
            response.status(400, error, res)
        }
        else if (rows.length > 0){

            const AccessToken = jwt.sign({
                email: rows[0].email
            }, config.get('jwtKey'), {expiresIn: "1h"})

            const RefreshToken = jwt.sign({
                email: rows[0].email
            }, config.get('jwtKey'), {expiresIn: '30d'})


            let updateTokenQuery = `UPDATE users SET token = "${AccessToken}", refreshtoken = "${RefreshToken}" WHERE email = "${rows[0].email}"`
            db.query(updateTokenQuery, (error,result) =>{
                if (error) {
                    response.status(400, error, res)
                } else {
                    response.status(200, {message: 'Токен очищен', AccessToken, RefreshToken}, res)
                }
            })
        }
        else{
            response.status(256, {message: "Пользователь не авторизован"}, res)
        }
    }).then(res =>{
        db.end()
    })
}
