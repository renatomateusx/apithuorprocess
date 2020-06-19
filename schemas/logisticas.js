var pool = require('../db/queries');
const utilis = require('../resources/util');
const unirest = require("unirest");
module.exports.GetFretes = (req, res, next) => {
    try {
        const { shop } = req.body;
        pool.query('SELECT * FROM transportadoras where url_loja = $1', [shop], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(results.rows);
            res.end();
        })
    } catch (error) {
        res.json(error);
        res.end();
    }
}


module.exports.TrackingCodeTem = (req, res, next) => {
    try {
        const { code } = req.body;
        var LBody = {
            locale: 'pt',
            trackingCode: code
        }
        var req = unirest("GET", "https://apidojo-17track-v1.p.rapidapi.com/track");
        req.query({
            "timeZoneOffset": "0",
            "codes": code
        });
        req.headers({
            "x-rapidapi-host": "apidojo-17track-v1.p.rapidapi.com",
            "x-rapidapi-key": "497d51e01cmshdbb8866239b2795p19ec14jsnf11eb5d622c2",
            "useQueryString": true
        });       
        
        req.end(function (res) {
            if (res.error) throw new Error(res.error);        
            console.log(res.body);
        });
    } catch (error) {
        res.json(error);
        res.end();
    }
}


module.exports.TrackingCode = (req, res, next) => {
    try {
        const { code } = req.body;
        var LBody = {
            locale: 'pt',
            trackingCode: code
        }
        const Lurl = "https://api-track.ebanx.com/production/track";
        utilis.makeAPICallExternalParamsJSON(Lurl, "", LBody, undefined, undefined, "POST")
            .then((resRet) => {
                //console.log(resRet.body);
                res.status(200).send(resRet.body);
                res.end();
            })
            .catch((error) => {
                console.log("Erro", error);
            })
    } catch (error) {
        res.json(error);
        res.end();
    }
}

module.exports.TrackingCodeInternal = (code) => {
    return new Promise((resolve, reject) => {
        try {
            var LBody = {
                locale: 'pt',
                trackingCode: code
            }
            const Lurl = "https://api-track.ebanx.com/production/track";
            utilis.makeAPICallExternalParamsJSON(Lurl, "", LBody, undefined, undefined, "POST")
                .then((resRet) => {
                    ///console.log(resRet.body);
                    resolve(resRet.body);
                })
                .catch((error) => {
                    reject(error);
                })
        } catch (error) {
            reject(error);
        }
    })

}

module.exports.TrackingCodeInternalNinja = (code) => {
    return new Promise((resolve, reject) => {
        try {
            var LBody = {               
            }
            const Lurl = "https://rastreio.ninja/buscar/"+code;
            utilis.makeAPICallExternalParamsJSON(Lurl, "", LBody, undefined, undefined, "GET")
                .then((resRet) => {
                    ///console.log(resRet.body);
                    resolve(resRet.body);
                })
                .catch((error) => {
                    reject(error);
                })
        } catch (error) {
            reject(error);
        }
    })

}