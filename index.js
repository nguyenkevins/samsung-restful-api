/*

NodeJS
RESTful API
WebScraper


## Import Terminology ##

Express — Framework that helps you take care of routing and server 
side mumbo-jumbo, and is also capable of templating.

Request — This package helps us make HTTP requests and calls.

Cheerio — This is jQuery on the Server Side. Scrapes the DOM.

*/

const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();

function addStr(str, index, stringToAdd) {
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

function modURL(str, index) {
    let result = "";
    let cur = str.length - 1;
    while (str.charAt(cur) != '-') {
        cur = cur - 1;
    }
    cur = cur + 1;
    result = addStr(str, cur, "f-");

    cur = result.length - 1;
    while (result.charAt(cur) != '.') {
        cur = cur - 1;
    }
    result = addStr(result, cur, "-0-p" + index);

    return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



var arrayToJSON = new Array;

app.get('/', function (req, res) {
    let url = "https://www.gsmarena.com/"
    resetURL2 = "https://www.gsmarena.com/samsung-phones-9.php";
    // https://www.gsmarena.com/samsung-phones-9.php
    // Page Loop
    for (let i = 0; i < 1; i++) {
        url2 = resetURL2;
        url2 = modURL(url2, i);
        //console.log(url2);
        request(url2, function (error, response, html) {
            if (!error) {
                var $$ = cheerio.load(html);
                $$('body > div#wrapper.l-container > div#outer.row > div#body.clearfix > div.main.right.main-maker.l-box.col > div#review-body.section-body > div.makers > ul > li > a').each(function (j, link2) {
                    //console.log(url + $$(link2).attr('href'))
                    //fs.appendFile('helloworld.txt', url + $$(link2).attr('href') + "\n", function (err) {
                    //  if (err) return console.log(err);
                    //console.log(url + $$(link2).attr('href'));
                    //});
                    let url4 = url + $$(link2).attr('href');
                    var label = new Array;
                    var data = new Array;
                    var name = "";
                    request(url4, function (error, response, html) {
                        if (!error) {
                            var $$$ = cheerio.load(html);

                            $$$('body > div#wrapper.l-container > div#outer.row > div#body > div.main.main-review.right.l-box.col > div#specs-list > table > tbody > tr > td.ttl').each(function (k, link3) {
                                phrase = String($$$(link3).text())
                                label.push(phrase);
                            });

                            $$$('body > div#wrapper.l-container > div#outer.row > div#body > div.main.main-review.right.l-box.col > div#specs-list > table > tbody > tr > td.nfo').each(function (k, link3) {
                                phrase = String($$$(link3).text())
                                data.push(phrase);
                            });

                            name = $$$('body > div#wrapper.l-container > div#outer.row > div#body > div.main.main-review.right.l-box.col > div.review-header > div.article-info > div.article-info-line.page-specs.light.border-bottom > h1.specs-phone-name-title').text();
                        }
                        let x = 2;
                        //console.log(label);
                        //console.log(data[x]);
                        var removeIndex = new Array;
                        let position = 0
                        const letterNumber = /^[0-9a-zA-Z]+$/;
                        for (let i = 0; i < Object.keys(label).length; i++) {
                            if (label[i].charAt(0).match(letterNumber)) {
                                position = i;
                            } else {
                                data[position] = data[position] + " / " + data[i];
                                removeIndex.push(i);
                            }
                        }
                        //console.log(removeIndex)

                        for (let i = Object.keys(removeIndex).length - 1; i >= 0; i--) {
                            label.splice(removeIndex[i], 1);
                            data.splice(removeIndex[i], 1);
                        }
                        label.unshift("Name");
                        label.unshift("id");
                        data.unshift(name);
                        const id = name.replace(/\s+/g, '')
                        data.unshift(id)
                        


                        var object = Object.fromEntries(Object.entries(data).map(([key, value]) => [label[key], value]));
                        //res.write(object); // WORK ON ADDING ELEMENTS TO JSON ONE AT THE TIME
                        console.log(object)
                        arrayToJSON.push(object);
                    });


                });

            }

        });
    }
    console.log(arrayToJSON)


});



        //console.log(prediction)
        /*
        // And now, the JSON format we are going to expose
        var json = {
          date: date,
          sign: sign,
          prediction: prediction
        };
  
        // Send the JSON as a response to the client
        res.send(json);
        */


app.listen(process.env.PORT || 5000);
module.exports = app;