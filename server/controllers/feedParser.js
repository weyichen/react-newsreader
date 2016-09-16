const request = require('request');
const FeedParser = require('feedparser');
const htmlparser = require('htmlparser2');

exports.getMeta = (url) => {
  return new Promise((resolve, reject) => {
    setup(url)
    .then(parser => {
      parser.on('readable', function() { // do not use arrow fn!!!!!!!!!!!!!!!!!!!
        if (!this.meta.xmlurl) this.meta.xmlurl = url;
        resolve(this.meta); // *this* is why
      });
    })
    .catch(error => reject(error));
  });
}

exports.cleanMeta = (meta) => {
  var image = meta.image && meta.image.url;
  return {
    name: meta.title,
    rss: meta.xmlurl,
    description: meta.description,
    image: image,
  };
}

exports.getItems = (url) => {
  return new Promise((resolve, reject) => {
    setup(url)
    .then(parser => {
      var meta, items = [], i = 0;
      parser.on('readable', function() { // do not use arrow fn!!!!!!!!!!!!!!!!!!!
        var stream = this; // *this* is why
          var item;
          if (!this.meta.xmlurl) this.meta.xmlurl = url;
          meta = this.meta;
          while(item = stream.read()) {
            items[i] = item;
            i++;
          }
      });
      parser.on('end', () => {
        resolve({items: items, meta: meta});
      });
    })
    .catch(error => reject(error));
  });
}

exports.cleanItems = (feed) => {
  return Promise.all([
    exports.cleanMeta(feed.meta),
    Promise.all(feed.items.map((item) => cleanItem(item)))
  ]);
}


function setup (url) {
  return new Promise((resolve, reject) => {
    var feedParser = new FeedParser();
    feedParser.on('error', (error) => {
      reject(error);
    });

    request
    .get(url)
    .on('error', (error) => {
      reject(error);
    })
    .on('response', (response) => {
      if (response.statusCode !== 200) {
        reject('HTTP response error ' + response.statusCode);
      }
      resolve(feedParser);
    })
    .pipe(feedParser);
  });
}

function cleanItem (item) {
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
      item['media:content']['@'].medium === 'image' &&
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

    var imgFound = false;
    var htmlParser = new htmlparser.Parser({
      onopentag: (name, atts) => {
        if (!imgFound && name==='img') {
          cleaned.image = atts.src;
          imgFound = true;
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