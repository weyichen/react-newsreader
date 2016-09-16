const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('./config/passport');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const feedParser = require('./controllers/feedParser');

const app = express();
const routes = require('./routes');

const CF = require('./config');
app.set('port', process.env.PORT || 3000);

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
app.use('/', express.static(path.join(__dirname, '/..', '/dist')));

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
  feedParser.getItems(req.query.feedUrl)
  .then(r => feedParser.cleanItems(r))
  .then(r => res.send({ ok: true, data: { meta: r[0], items: r[1] } }));
});

app.get('/get-meta', (req, res) => {
  feedParser.getMeta(req.query.feedUrl)
  .then(meta => feedParser.cleanMeta(meta))
  .then(meta => res.json({ ok: true, data: meta }))
  .catch(error => res.json({ ok: false, error: error }));
});

// returns just the first item in the feed with metadata so we can examine it
app.get('/rawfeed', (req, res) => {
  feedParser.getItems(req.query.feedUrl)
  .then((r) => res.json({ ok: true, data: {meta: r.meta, items: [r.items[0]] }}))
  .catch(error => res.json({ ok: false, error: error }));
});


app.get('*', (req, res) => {
  if (!path.extname(req.path)) {
    res.sendFile('index.html', {root: __dirname + '/../dist'});
  }
  else {
    res.status(404).end();
  }
});

app.listen(app.get('port'), () => {
  console.log('Node app running on port', app.get('port'));
});