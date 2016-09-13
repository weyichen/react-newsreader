const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('./config/passport');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const feedHelpers = require('./processFeedHelpers');

const app = express();
const routes = require('./routes');

const CF = require('./config');
app.set('port', 3000);

/**
  ** DB CONNECTION **
**/
mongoose = require('mongoose');
// use the native promise library, as the mongoose mpromise library is deprecated
mongoose.promise = global.Promise;
mongoose.connect(CF.MONGODB_URI, function (err) {
  if (err) console.log(err);
  else console.log("connected to mongodb!");
});

/**
  ** MIDDLEWARE **
**/
app.use('/', express.static(path.join(__dirname, '/..', '/client/dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this uses the mongoDB connection to maintain a persistent session
app.use(session({
  secret: CF.SESSION_SECRET,
  cookie : {
    maxAge: CF.COOKIE_MAXAGE
  },
  store: new MongoStore({mongooseConnection:mongoose.connection}),
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// place all middleware before all routes

/**
  ** ROUTES **
**/
app.use('/', routes);


app.get('/parsefeed', (req, res) => {
  feedHelpers.parseFeed(req.query.feedUrl)

    .then( (r) => {
      const meta = r[0].meta;
      var image = meta.image && meta.image.url;

      return Promise.all([
        {title: meta.title, image: image},
        Promise.all( r.map( (item) => feedHelpers.cleanItem(item) ) )
      ]);
    })

    .then((r) => res.send({ ok: true, data: { meta: r[0], items: r[1] } }));
});


// returns just the first item in the feed with metadata so we can examine it
app.get('/rawfeed', (req, res) => {
  feedHelpers.parseFeed(req.query.feedUrl)
    .then((r) => {
      r.ok = true;
      res.send(r[0]);
    })
});


app.get('*', (req, res) => {
  if (!path.extname(req.path)) {
    res.sendFile('index.html', {root: __dirname + '/../client/'});
  }
  else {
    res.status(404).end();
  }
});

app.listen(app.get('port'), () => {
  console.log('Node app running on port', app.get('port'));
});