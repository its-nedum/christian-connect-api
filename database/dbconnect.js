// //This DB connect handles queries made with the use of Sequelize ORM
// const {Client} = require('pg')
// const conString = process.env.ELEPHANT_SQL_DB || process.env.LOCAL_DB_URL
// const client = new Client(conString)

// if(client.connect()){
//     console.log("Pg DB connected successfully")
// }else{
//     console.log("Pg DB connection failed")
// } 
 
// module.exports = client