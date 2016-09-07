var dependencies = (function() {
    var fs = require('fs');
    var request = require('request');
    var cheerio = require('cheerio');
    return {
        fs: fs,
        request: request,
        cheerio: cheerio,
    };
})();


var scraper = (function() {
    var urls = [];
    var urls_counter;
    var url_entry = 'http://electron.atom.io/docs/';
    var urls_results = [];

    var scrape = function() {
        reset();
        dependencies.request(url_entry, function(error, response, html) {
            if (!error) {
                var $ = dependencies.cheerio.load(html);

                $('a').each(function(i, elem) {
                    try {
                        urls.push({
                            'url': elem.attribs.href
                        });
                    } catch (err) {
                        console.log(err);
                    }
                });

                for (var i = 0; i < urls.length; i++) {
                    verify(urls[i].url);
                }

                while (urls_counter != 0) { }

                console.log(urls.length);
                console.log(urls_results.length);

            }
        })
    };

    var verify = function(url) {
        console.log("out - " + urls_counter++ + ": "  + url);
        dependencies.request(url, function(error, response, html) {
            if (error) {
                urls_results.push({
                    'url': url,
                    'error': error
                });
            };
            console.log("out - " + urls_counter-- + ": "  + url);
        })
    };

    var reset = function() {
        urls = [];
        urls_results = [];
        urls_counter = 0;
    };
    return {
        scrape: scrape
    }
})();