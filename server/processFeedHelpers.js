const request = require('request');
const FeedParser = require('feedparser');
const htmlparser = require('htmlparser2');

exports.parseFeed = function(feedUrl) {
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


exports.cleanItem = function(item) {
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