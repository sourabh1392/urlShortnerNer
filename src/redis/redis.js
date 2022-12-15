const redis=require("redis")
const { promisify } = require("util")

const redisClient = redis.createClient(
    17269,
    "redis-17269.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);

redisClient.auth("L9uCuh4Xbc3rXguxyUH9LQUOwl3UlXU1", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

module.exports={SET_ASYNC,GET_ASYNC}