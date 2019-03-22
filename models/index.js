const Sequelize = require("sequelize");

//Configuration for connection to database
//instance of sequelize
//(database, username, password, options)
const sequelize = new Sequelize("books-api", "postgres", "whydoineedpassword", {dialect: "postgres", logging: false})

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