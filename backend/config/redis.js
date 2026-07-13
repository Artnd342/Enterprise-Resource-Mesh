const IORedis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required for BullMQ compatibility
});

redisConnection.on('connect', () => {
  console.log('🛑 Redis Connection established for high-concurrency event loops');
});

module.exports = redisConnection;