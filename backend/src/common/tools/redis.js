import { createClient } from 'redis';

const RedisClient = createClient({
            password:  process.env.REDIS_PASSWORD
        });

RedisClient.on(
    'error',
        err => console.log('[ERROR] - Redis Client Error : ', err)
);
RedisClient.connect().then(
    () => console.log('[INFO] - Redis Client is up !')
);

export default RedisClient