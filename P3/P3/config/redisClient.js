const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("connect", () => {
  console.log("Redis Connected...");
});

module.exports = redisClient;