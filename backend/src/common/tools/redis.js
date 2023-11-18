import { createClient } from 'redis';

const RedisClient = createClient({
    password:  process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

RedisClient.on(
    'error',
        err => console.log('[ERROR] - Redis Client Error : ', err)
);
RedisClient.connect().then(
    () => console.log('[INFO] - Redis Client is up !')
);

export default RedisClient;