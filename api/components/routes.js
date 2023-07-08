const passport = require('passport');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json({ "status": "error", "payload": "No user authenticated" });
};

const routes = (app, newUser, getChat) => {
    app.route('/login').post(passport.authenticate('local', { failureRedirect: "/failed-login", session: true }), (req, res) => {
        res.json({ "status": "success", "payload": req.user });
    }, (err, req, res) => {
        res.json({ "status": "error", "payload": err.message });
    });

    app.route('/register').post((req, res) => {
        newUser({ username: req.body.username, password: req.body.password }).then(x => {
            res.json(x);
        }).catch(err => {
            res.json({ "status": "error", "payload": err.message });
        });
    });

    app.route("/chat").get(ensureAuthenticated, (req, res) => {
        getChat("general").then((chat) => {
            res.json({ "status": "success", "payload": chat });
        }).catch(err => {
            res.json({ "status": "error", "payload": err });
        });
    });

    app.route("/failed-login").get((req, res) => {
        res.json({ "status": "error", "payload": "Failed authentication" });
    });

    app.route('/logout').get((req, res) => {
        req.logout();
        res.json({ "status": "success", "payload": "logout" });
    });

    app.use((req, res, next) => {
        res.status(404).type('text').send('Not Found');
    });
}

module.exports = {
    routes: routes
}