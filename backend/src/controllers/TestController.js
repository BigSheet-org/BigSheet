import sequelize from "../common/tools/postgres.js";
import Data from "../common/data/Data.js";
import RedisClient from "../common/tools/redis.js";

class TestController {

    /**
     * This method is used to test the POSTGRESQL connexion.
     *
     * @param req Request object.
     * @param res Response object.
     */
    static async testPostgresConnextion(req, res) {
        let message
        try {
            await sequelize.authenticate()      // We try the connexion with the database.
            message = '[INFO] - Connection to the PostgreSQL database has been established successfully.';
        } catch (error) {
            message = '[ERROR] - Connection to the PostgreSQL database has failed !\n' + 'Error : ' + error;
        }

        return res.send({"message": message});
    }

    /**
     * This method is used to test the REDIS connexion.
     *
     * @param req Request object.
     * @param res Response object.
     */
    static testRedisConnexion(req, res) {
        RedisClient.connect()
            .then(r => {
                return res.send('[INFO] - Connection to the REDIS database has been established successfully.');
            })
            .catch(r => {
                return res.send('[ERROR] - Connection to the PostgreSQL database has failed !\n' + 'Error : ' + r);
            });
    }

    /**
     * This method is used to tests the connection with the NodeJS server.
     *
     * @param req Request object.
     * @param res Response object.
     * @returns {*}
     */
    static testServer(req, res) {
        return res.send({
            message: "[INFO] - Server is up ! You can make requests."
        });
    }
}

export default TestController;