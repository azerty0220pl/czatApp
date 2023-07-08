const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const store = new MongoStore({ url: process.env.MONGO_URI });

const expressApp = () => {
    const app = express();
    
    app.set('trust proxy', true);
    
    const server = http.createServer(app);
    
    app.use(bodyParser.urlencoded({ extended: true }))
        .use(bodyParser.json())
        .use(cookieParser())
        .use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: true,
                saveUninitialized: true,
                cookie: {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000
                },
                key: 'express.sid',
                store: store,
                proxy: true
            }))
        .use(passport.initialize())
        .use(passport.session())
        .use(cors({
            origin: 'https://azerty0220pl.github.io',
            credentials: true
        }));
    
    server.listen(5000, () => 'Server is running on port 4000');
    return {app: app, server: server};
}

module.exports ={
    express: expressApp,
    session: session,
    store: store
}