const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const FeedParser = require('feedparser');
const path = require('path');
const htmlparser = require("htmlparser2");

const app = express();

app.set('port', 3000);

app.use('/', express.static(path.join(__dirname, '/..', '/client/dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/parsefeed', (req, res) => {
  parseFeed(req.query.feedUrl)
    .then( (r) => {
      return Promise.all( r.map( (item) => cleanItem(item) ) );
    } )
    .then( (r) => res.send( {ok: true, items: r} ) );
});

app.get('/rawfeed', (req, res) => {
  parseFeed(req.query.feedUrl)
    .then((r) => {
      r.ok = true;
      res.send(r);
    })
});

function parseFeed(feedUrl) {
  return new Promise((resolve, reject) => {
    var feedParser = new FeedParser();
    request
      .get(feedUrl)
      .on('error', (error) => {
        reject(error);
      })
      .on('response', (response) => {
        if (response.statusCode !== 200) {
          reject('HTTP response error ' + response.statusCode);
        }
      })
      .pipe(feedParser);

    feedParser.on('error', (error) => {
      reject(error);
    });

    var items = [], i = 0;
    feedParser.on('readable', function() { // do not use arrow fn!!!!!!!!!!!!!!!!!!!
      var stream = this; // *this* is why
        
        var item;
        while(item = stream.read()) {
          items[i] = item;
          i++;
        }
    });

    feedParser.on('end', () => {
      resolve(items);
    });

  });  
}


function cleanItem(item) {
  return new Promise((resolve, reject) => {
    var cleaned = {
      guid: item.guid,
      title: item.title,
      description: item.description,
      date: item.date,
      link: item.link
    };

    if (cleaned.image = 
      item.image && 
      item.image.url
    )
      return resolve(cleaned);

    if (cleaned.image = 
      item['media:content'] && 
      item['media:content']['@'] && 
      item['media:content']['@'].url
    )
      return resolve(cleaned);

    if (cleaned.image =
      item['media:group'] && 
      item['media:group']['media:content'] && 
      item['media:group']['media:content'][0] &&
      item['media:group']['media:content'][0]['@'] &&
      item['media:group']['media:content'][0]['@'].url
    )
      return resolve(cleaned);

    var htmlParser = new htmlparser.Parser({
      onopentag: (name, atts) => {
        if (name==='img') {
          cleaned.image = atts.src;
          return resolve(cleaned);
        }
      },
      onend: () => {
        if (cleaned.image)
          return resolve(cleaned);
        cleaned.image = item.meta.image && item.meta.image.url;
        return resolve(cleaned);
      }
    });
    htmlParser.write(item.description);
    htmlParser.end();
  });       
}


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