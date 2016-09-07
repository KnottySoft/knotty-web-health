var dependencies = (function () {
    var fs = require('fs');
    var request = require('request');
    var cheerio = require('cheerio');
    return {
        fs: fs,
        request: request,
        cheerio: cheerio,
    };
})();


var scraper = (function () {
    var urls = [];
    var urls_cnt_start, urls_cnt_done;
    var url_entry = 'http://electron.atom.io/docs/';
    var urls_results = [];
    var timer;

    var scrape = function () {
        reset();
        dependencies.request(url_entry, function (error, response, html) {
            if (!error) {
                var $c = dependencies.cheerio.load(html);

                $c('a').each(function (i, elem) {
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

                timer = window.setInterval(isRunning, 1000);
            }
        })
    };

    var isRunning = function () {
        if (urls_cnt_done == urls_cnt_start) {
            print();
            window.clearInterval(timer);
        }
    }

    var verify = function (url) {
        console.log("IN =  " + (urls_cnt_start++) + ": " + url);
        dependencies.request(url, function (error, response, html) {
            if (error) {
                urls_results.push({
                    'url': url,
                    'error': error
                });
            };
            console.log("OUT = " + (urls_cnt_done++) + ": " + url);
        })
    };

    var print = function () {
        for (var i = 0; i < urls_results.length; i++) {
            $("#results").append("url: " + urls_results[i].url + " - error: " + urls_results[i].error + "<br>");
        }
    }

    var reset = function () {
        urls = [];
        urls_results = [];
        urls_cnt_start = 0;
        urls_cnt_done = 0
    };
    return {
        scrape: scrape
    }
})();