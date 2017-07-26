let express = require('express');
let passport = require('passport');

let User = require('./models/user');
let Contents = require("./models/content");

let router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }
}

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.get('/', function(req, res) {
    res.redirect('/projects');
})

router.get('/new-projects', function(req, res) {
    res.render("new-projects");
})

router.post('/new-projects', function(req, res) {
    if(!req.body.title || req.body.spec || !req.body.workstyle) {
        response.status(400).send("Fill the blanks!");
        return;
    }

    if (!req.user) {
        res.sendStatus(400);
        return;
    }

    let currentUser = req.user;

    let newProjects = new Contents({
        
    })
})

