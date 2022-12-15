const urlModel = require("../models/urlModel")
const validator = require("validator")
const shortid = require("shortid")
// const redis = require("redis")
// const { promisify } = require("util")
const baseUrl = "http://localhost:3000/"
const {SET_ASYNC,GET_ASYNC}=require("../redis/redis")

// const redisClient = redis.createClient(
//     17269,
//     "redis-17269.c264.ap-south-1-1.ec2.cloud.redislabs.com",
//     { no_ready_check: true }
// );

// redisClient.auth("L9uCuh4Xbc3rXguxyUH9LQUOwl3UlXU1", function (err) {
//     if (err) throw err;
// });

// redisClient.on("connect", async function () {
//     console.log("Connected to Redis..");
// });

// const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
// const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl;
        if (Object.keys(longUrl).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter Longurl to create shorturl" })
        }
        if (!longUrl)
            return res.status(400).send({ status: false, message: "Please provide LongUrl" });
            
        if (!validator.isURL(longUrl)) {
            return res.status(400).send({ status: false, message: "Not a valid url" })
        }
        let cachedLongUrl=await GET_ASYNC(`${longUrl}`)
        console.log(cachedLongUrl)
        let Link=JSON.parse(cachedLongUrl)
        console.log(Link)
        if(Link){
            return res.status(200).send({ longUrl: Link.longUrl, urlCode: Link.urlCode, shortUrl: Link.shortUrl })
        }
        // const checkUrl = await urlModel.findOne({ longUrl: longUrl })
        // if (checkUrl) {
        //     return res.status(400).send({ status: false, message: "LongUrl already used" })
        // }
        const urlCode = shortid.generate(longUrl);
        const shortUrl = baseUrl + urlCode;

        const url = { longUrl: longUrl, urlCode: urlCode, shortUrl: shortUrl };

        const Data = await urlModel.create(url)
        await SET_ASYNC(`${longUrl}`, JSON.stringify(Data))
        return res.status(201).send({ status: true, data: { longUrl: Data.longUrl, shortUrl: Data.shortUrl, urlCode: Data.urlCode } });
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
        let cachedUrl = await GET_ASYNC(`${req.params.urlCode}`)
        
        let objCache = JSON.parse(cachedUrl)
        
        if (objCache) {
            return res.status(302).redirect(objCache.longUrl)
        }
        else {
            let presenturl = await urlModel.findOne({ urlCode: urlCode })
            if (!presenturl) {
                return res.status(404).send({ status: false, message: "Urlcode is not valid" })
            }
            await SET_ASYNC(`${urlCode}`, JSON.stringify(presenturl))
            return res.status(302).redirect(presenturl.longUrl)
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUrl, getUrl }




