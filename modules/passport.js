require("dotenv").config();

const BCRIPT_SALT_ROUNDS = 12;
const jwtSecret = require("../config/config.json").PW_SECRET_KEY;

const db = require("../models");
const bcrypt = require("bcrypt");

const passport = require("passport"),
  localStrategy = require("passport-local").Strategy,
  JWTstrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt;
const getRandomNickName = require("./getRandomNickName");

passport.use(
  "register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false
    },
    (req, email, password, done) => {
      try {
        db.users
          .findOne({
            where: {
              email: email
            }
          })
          .then(async user => {
            if (user !== null) {
              return done(null, false, { message: "This user is already!" });
            } else {
              let getNickname = await getRandomNickName(email.split("@")[0]);
              if (password === "SocIaL") {
                console.log("SOCIAL REGISTER !!!");
                if (req.body.provider === "google") {
                  console.log("GOOGLE !!!");
                  return done(null, user);

                  //   db.users
                  //     .create({
                  //       email: email,
                  //       name: req.body.name,
                  //       provider: req.body.provider,
                  //       google_id: req.body.socialId,
                  //       image: req.body.imageURL
                  //     })
                  //     .then(user => {
                  //       return done(null, user);
                  //     });
                }
              } else {
                console.log("LOCAL REGISTER !!!");
                bcrypt
                  .hash(password, BCRIPT_SALT_ROUNDS)
                  .then(hashedPassword => {
                    db.users
                      .create({
                        email: email,
                        password: hashedPassword,
                        nickname: getNickname,
                        provider: "aurora"
                      })
                      .then(user => {
                        return done(null, user);
                      });
                  });
              }
            }
          });
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false
    },
    (email, password, done) => {
      try {
        db.users
          .findOne({
            where: {
              email: email
            }
          })
          .then(user => {
            if (user === null) {
              return done(null, false, { message: "Not user!" });
            } else {
              bcrypt.compare(password, user.password).then(response => {
                if (response !== true) {
                  return done(null, false, {
                    message: "Password do not match!"
                  });
                }
                return done(null, user);
              });
            }
          });
      } catch (err) {
        done(err);
      }
    }
  )
);
