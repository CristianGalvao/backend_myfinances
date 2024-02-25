const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const database = require("../database/database");
const sendEmail = require('../functions/send_email')



router.post('/register_user', (req,res)=>{

    let {email} = req.body;
    let {first_name} = req.body;
    let {password} = req.body;
    
  const sql = `SELECT * FROM user WHERE email = '${email}';`;

  get_verify_email_if_exists = async function () {
    return new Promise(function (resolve, reject) {
      database.query(sql, async function (err, rows) {

        if (rows === undefined || rows == null || rows == '') {

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, function (err, hash) {

              //TOKEN-
              const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: 300 });

              const sql = `INSERT INTO user (first_name, email, password) VALUES ("${first_name}", "${email}", "${hash}")`;

              try {
                database.query(sql, function (err, result) {
                  if (result) {
                    sendEmail.send_email_nodemailer(email)
                    console.log(result)
                    res.send(result)
                  }
                })
              } catch {
                console.log(err)
              }
            })
          })

        } else {
        console.log("User already exist")
          resolve("User already exist")
        }
      })
    })
  }

  get_verify_email_if_exists()
    .then(function (results) {
      res.send(results)
    })
    .catch(function (err) {
      console.log(err)
    });
});



router.put('/update_verification', (req,res)=>{
    
})

module.exports = router