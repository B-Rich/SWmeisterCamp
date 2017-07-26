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

router.get('/projects', function(req, res) {
    let responseData = [];
    Contents.find({}).sort({ date: -1 }).exec(function (err, rawContents) {
        if (err) throw err;
        if (rawContents.length > 0) {
            var index = 0;
            rawContents.forEach(function (item) {
                index++;
                responseData.push({
                    index: index,
                    title: item.title,
                    spec: item.spec,
                    workstyle: item.workstyle,
                    author: item.author
                });
            });
            res.render("projects", {Contents: responseData});
        }
        else {
            res.render("projects", {Contents: responseData});
        }
    });
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
        title: req.body.title,
        spec: req.body.apec,
        workstyle: req.body.workstyle,
        date: new Date(),
        author: currentUser
    })
    newProjects.save('next');
    res.redirect('/projects');
})

router.get('/profiles', function(req, res) {
    let responseData = [];
    User.find({}).sort({ date: -1 }).exec(function (err, rawContents) {
        if (err) throw err;
        if (rawContents.length > 0) {
            var index = 0;
            rawContents.forEach(function (item) {
                index++;
                responseData.push({
                    index: index,
                    username: item.username,
                    displayname: item.displayName,
                    spec: item.spec,
                    bio: item.bio,
                    resume: item.resume
                });
            });
            res.render("profiles", {users: responseData});
        }
        else {
            res.render("profiles", {users: responseData});
        }
    });
})

router.get('/search', function(req, res) {
    let projects = req.query.projects;
    let specs = req.query.specs;

    if(!projects || !specs) {
        res.redirect('/projects');
    }

    if (projects && specs) {
        res.send("Type something");
        return;
    }

    if (!projects) {
        User.find({ spec: { $regex: new RegExp(specs, "i") } }).sort({ date: -1 }).exec(function (err, rawContents) {
        if (err) throw err;
        if (rawContents.length > 0) {
            var index = 0;
            rawContents.forEach(function (item) {
                index++;
                responseData.push({
                    index: index,
                    title: item.title,
                    spec: item.spec,
                    workstyle: item.workstyle,
                    author: item.author
                });
            });
            res.render("search", {Contents: responseData});
        }
        else {
            res.render("search", {Contents: responseData});
        }
    });
    }
    if (!specs) {
        Contents.find({ spec: { $regex: new RegExp(projects, "i") } }).find({}).sort({ date: -1 }).exec(function (err, rawContents) {
        if (err) throw err;
        if (rawContents.length > 0) {
            var index = 0;
            rawContents.forEach(function (item) {
                index++;
                responseData.push({
                    index: index,
                    title: item.title,
                    spec: item.spec,
                    workstyle: item.workstyle,
                    author: item.author
                });
            });
            res.render("search", {Contents: responseData});
        }
        else {
            res.render("search", {Contents: responseData});
        }
    });
    }
})

router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {

    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }

    var newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);

  });
}, passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/signup",
  failureFlash: true
}));

router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.render("profile", { user: user });
  });
});

router.get("/edit", ensureAuthenticated, function(req, res) {
  res.render("edit");
});

router.post("/edit", ensureAuthenticated, function(req, res, next) {
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  req.user.spec = req.body.spec;

  req.user.save(function(err) {
    if (err) {
      next(err);
      return;
    }
    req.flash("info", "Profile updated!");
    res.redirect("/edit");
  });
});

module.exports = router;

