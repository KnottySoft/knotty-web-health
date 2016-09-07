var dependencies = (function() {
    var express = require('express');
    var fs = require('fs');
    var request = require('request');
    var cheerio = require('cheerio');
    var server = require('http');
    return {
        express: express,
        fs: fs,
        request: request,
        cheerio: cheerio,
        http: server
    };
})();

var app = dependencies.express();
var server = dependencies.http.createServer(app);

app.get('/scrape', function(req, res) {

    // The URL we will scrape from - in our example Anchorman 2.

    url = 'http://crtcappsdev/ApplicationMatrix/external.htm';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html
    var table = [];
    dependencies.request(url, function(error, response, html) {
        if (!error) {
            var $ = dependencies.cheerio.load(html);

            var title, release, rating;

            // We'll use the unique header class as a starting point.

            $('a').each(function(i, elem) {
                try {
                    table.push({
                        'url': elem.attribs.href
                    });
                } catch (err) {
                    console.log(err);
                }

            });

            res.send(table);
        }
    })

})

server.listen(3002, function() {
    console.log('Server listening at port %d', 3002);
});

exports = module.exports = app;