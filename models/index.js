const Sequelize = require("sequelize");

//Configuration for connection to database
//instance of sequelize
//(database, username, password, options)
// const sequelize = new Sequelize("books-api", "postgres", "whydoineedpassword", {dialect: "postgres", logging: false})
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
let sequelize;
//Connect to different database depending on env
if(env === "production"){
  sequelize = new Sequelize(config.url, config.options);
} else{
  sequelize = new Sequelize(config.database, config.username, config.password, config.options);
}

//Pass models to connection
const models = {
    Book: sequelize.import("./Book"),
    Author: sequelize.import("./Author")
}

//Link all models
Object.keys(models).forEach(key => {
    if("associate" in models[key]) {
        models[key].associate(models);
    }
});

module.exports = {
    sequelize, //for setup database later
    ...models
};