const { express, session, store } = require("./components/expressApp");
const { app, server } = express();

const { connect, newUser, getUser, getChat, sendMessage } = require("./components/databaseMan");
const { routes } = require('./components/routes');

connect().then(() => {
    console.log("Connected to database.");
    routes(app, newUser, getChat);
}).catch((err) => {
    console.log("Could not connect to database.");
    console.log(err);
});