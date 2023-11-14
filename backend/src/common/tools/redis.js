import { createClient } from 'redis';

const client = createClient();

client.on(
    'error',
        err => console.log('[ERROR] - Redis Client Error : ', err)
);
client.connect().then(
    () => console.log('[INFO] - Redis Client is up !')
);

export default client