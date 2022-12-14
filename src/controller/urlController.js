const urlModel = require("../models/urlModel")
const validator = require("validator")
const shortid = require("shortid")
const redis = require("redis")
const { promisify } = require("util")
const baseUrl = "http://localhost:3000/"


const redisClient = redis.createClient(
    17269,
    "redis-17269.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);

redisClient.auth("A5kenmat9j29n1jvv290k66ud9zv2e4uw9i0i0m2bfpb84mcius", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//2. Prepare the functions for each command

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

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

        const checkUrl = await urlModel.findOne({ longUrl: longUrl })
        if (checkUrl) {
            return res.status(400).send({ status: false, message: "LongUrl already used" })
        }
        const urlCode = shortid.generate(longUrl);
        const shortUrl = baseUrl + urlCode;

        const url = { longUrl: longUrl, urlCode: urlCode, shortUrl: shortUrl };

        const Data = await urlModel.create(url)
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
        let cahcedUrl = await GET_ASYNC(`${req.params.urlCode}`)
        if(cahcedUrl) {
            return res.status(302).redirect(presenturl.longUrl)
        }
        else {
            let presenturl = await urlModel.findOne({ urlCode: urlCode })
            if (!presenturl) {
                return res.status(404).send({ status: false, message: "Urlcode is not valid" })
            }
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(presenturl))
            return res.status(302).redirect(presenturl.longUrl)
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




// const fetchAuthorProfile = async function (req, res) 

// //3. Start using the redis commad
// let cahcedProfileData = await GET_ASYNC(`${req.params.authorId}`)
// if(cahcedProfileData) {
//   res.send(cahcedProfileData)
// } else {
//   let profile = await authorModel.findById(req.params.authorId);
//   await SET_ASYNC(`${req.params.authorId}`, JSON.stringify(profile))
//   res.send({ data: profile });
// }

module.exports = { createUrl, getUrl }




