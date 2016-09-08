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


    var is = (function () {
        var isRunning = function () {
            if (urls_cnt_done == urls_cnt_start) {
                commands.print();
                window.clearInterval(timer);
            }
        };

        var isValidUrl = function (url) {
            if (url.includes("http://")) {
                return true;
            }
            else if (url.includes("https://")) { return true; }

            return false;
        };


        return {
            running: isRunning,
            validUrl: isValidUrl
        }
    })();

    var commands = (function () {
        var verify = function (url) {
            if (is.validUrl(url)) {
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
            }
        };

        var print = function () {
            for (var i = 0; i < urls_results.length; i++) {
                $("#results").append("url: " + urls_results[i].url + " - error: " + urls_results[i].error + "<br>");
            }
        };

        var reset = function () {
            urls = [];
            urls_results = [];
            urls_cnt_start = 0;
            urls_cnt_done = 0
            timer = undefined;
        };
        var scrape = function () {
            reset();
            dependencies.request(url_entry, function (error, response, html) {
                if (!error) {
                    var cheerios = dependencies.cheerio.load(html);

                    cheerios('a').each(function (i, elem) {
                        try {
                            urls.push({
                                'url': elem.attribs.href
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    });

                    for (var i = 0; i < urls.length; i++) { verify(urls[i].url); }

                    timer = window.setInterval(is.running, 1000);
                }
            })
        };
        return {
            verify: verify,
            print: print,
            reset: reset,
            scrape: scrape
        }
    })();

    return {
        scrape: commands.scrape
    };
})();