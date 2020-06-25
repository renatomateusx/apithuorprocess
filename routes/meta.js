var express = require('express');
var router = express.Router();
const metascraper = require('metascraper')([
    require('metascraper-author')(),
    require('metascraper-date')(),
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-clearbit')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')()
])

const got = require('got')


router.post('/GetMeta', function (req, res, next) {
    const { url } = req.body;

    

    const targetUrl = url;
    (async () => {
        const { body: html, url } = await got(targetUrl)
        const metadata = await metascraper({ html, url })
        console.log(metadata)
        res.status(200).json(metadata);
    })()
});


module.exports = router;
