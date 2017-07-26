let express = require('express');
let passport = require('passport');

let User = require('./models/user');
let Contents = require("./models/content");

let router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
      res.sendStatus(400)
  }
}


router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

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
            res.status(200).send(responseData);
        }
        else {
            res.status(200).send([]);
        }
    });
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
    newProjects.save(() => {res.sendStatus(200)});
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
            res.status(200).send(responseData);
        }
        else {
            res.status(200).send([]);
        }
    });
})

router.get()

router.get('/search', function(req, res) {
    let projects = req.query.projects;
    let specs = req.query.specs;

    if(!projects || !specs) {
        res.sendStatus(400);
    }

    if (projects && specs) {
        res.sendStatus(400)
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
                    bio: item.bio,
                    spec: item.spec,
                    resume: item.resume,
                    dispalyName: item.dispalyName
                });
            });
            res.status(200).send(responseData);
        }
        else {
            res.status(200).send([]);
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
            res.status(200).send(responseData);
        }
        else {
            res.status(200).send([]);
        }
    });
    }
})

router.post("/login", passport.authenticate("login", {
  successRedirect: "/loginsuccess",
  failureRedirect: "/loginfailure",
}));

router.get("/loginsuccess", function(req, res) {
    res.sendStatus(200);
})

router.get("/loginfailure", function(req, res) {
    res.sendStatus(400);
})

router.get("/logout", function(req, res) {
  req.logout();
  res.sendStatus(200);
});

router.post("/signup", function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {

    if (err) { return next(err); }
    if (user) {
        res.sendStatus(400);
    }

    var newUser = new User({
      username: username,
      password: password
    });
    newUser.save((next) => {res.sendStatus(200)});

  });
}, passport.authenticate("login", {
  successRedirect: "/loginsuccess",
  failureRedirect: "/loginfailure",
}));

router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.status(200).send(user);
  });
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
    res.sendStatus(200);
  });
});

module.exports = router;

