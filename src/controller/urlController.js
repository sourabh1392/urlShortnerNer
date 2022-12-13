const urlModel = require("../models/urlModel")
const validator = require("validator")
const shortid = require("shortid")
const baseUrl = "http://localhost:3000/"

const createUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl;
        if(Object.keys(longUrl).length==0){
            return res.status(400).send({status:false,message:"Please Enter Longurl to create shorturl"})
        }
        if (!longUrl)
            return res.status(400).send({ status: false, message: "Please provide LongUrl" });
        if (!validator.isURL(longUrl)) {
            return res.status(400).send({ status: false, message: "Not a valid url" })
        }

        const checkUrl = await urlModel.findOne({ longUrl: longUrl })
        if (checkUrl){
             return res.status(400).send({ status: false, message: "LongUrl already used" })
        }
        const urlCode = shortid.generate(longUrl);  
        const shortUrl = baseUrl + urlCode;
        
        const url = { longUrl: longUrl, urlCode: urlCode, shortUrl: shortUrl };
        
        const Data = await urlModel.create(url)
        return res.status(201).send({ status: true, data: {longUrl:Data.longUrl, shortUrl:Data.shortUrl, urlCode:Data.urlCode} });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

const getUrl = async (req, res) => {
    try {
        const urlCode = req.params.urlCode
        if (!urlCode) {
            return res.status(400).send({ status: false, message: "Enter urlCode" })
        }
        if (!shortid.isValid(urlCode)) {
            return res.status(400).send({ status: false, message: "Please enter valid urlCode" })
        }
        let presenturl = await urlModel.findOne({ urlCode: urlCode })
        if (!presenturl) {
            return res.status(404).send({ status: false, message: "Urlcode is not valid" })
        }
        if (presenturl) {
            res.status(302).redirect(presenturl.longUrl)
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {createUrl,getUrl}