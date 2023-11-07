const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const auth = (getUser) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        db.getUser(id).then(doc => {
            done(null, doc.user);
        });
    });

    passport.use(new LocalStrategy((user, done) => {
        getUser(user.username).then(x => {
            if (x.status == 'error')
                return done(x.message);
            if (!x.user)
                return done(null, false);
            bcrypt.compare(user.password, x.user.password, (err, result) => {
                if (err || !result) {
                    return done(null, false);
                }
                return done(null, x.user.username);
            })
        }).catch(err => {
            return done(null, false);
        });
    }));
}


module.exports = {
    auth: auth
}