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
              //const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: 300 });
              const token = jwt.sign({email}, process.env.SECRET, { expiresIn: '10m' });  

              const sql = `INSERT INTO user (first_name, email, password) VALUES ("${first_name}", "${email}", "${hash}")`;

              try {
                database.query(sql, function (err, result) {
                  if (result) {
                    sendEmail.send_email_nodemailer(email, token)
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


router.get('/verify/:email/:token', (req, res)=>{ 
  const {token} = req.params; 
  const {email} = req.params;
  console.log(token)

  // Verifying the JWT token  
  jwt.verify(token, process.env.SECRET, function(err, decoded) { 
      if (err) { 
          console.log(err); 
          res.send("Verificação do Email falhou, possivelmente o link inválido ou expirado"); 
      } 
      else { 
          const sql_update_verification = `UPDATE user SET verified = 1 WHERE email = '${email}'`

          update_verified_token = async function(){
            return new Promise(function(resolve, reject){
              database.query(sql_update_verification, async function (err, rows) {
                if (rows === undefined || rows == null || rows == ''){
                  console.log(err)
                }else{
                  res.send("Email verificado com sucesso!");
                }
              })
            })
          }

          update_verified_token()
          .then(function (results) {
            res.send("Email verificado com sucesso!");
          })
          .catch(function (err) {
            console.log(err)
          }); 
      } 
  }); 
}); 

module.exports = router