const app = require("./app");
const { sequelize } = require("./models");
const createAuthorsAndBooks = require("./seed");

const port = process.env.PORT || 5555;

//To create connection, not yet connected
//force true will drop all models before connect for our lab purpose
sequelize.sync({force:true}).then(() => {
  //after table successfully created, seed the table
  createAuthorsAndBooks();
  //connect
  app.listen(port, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Server is running on Heroku with port number ${port}`);
    } else {
      console.log(`Server is running on http://localhost:${port}`);
    }
  });
})
