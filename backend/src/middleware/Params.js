class Params {

    /**
     * This method detects where parameters are stored in the request (body or URL) and places them inside the
     * res.locals.parameters object.
     * Acts like a middleware.
     *
     * @param req Request object. We extract the params from there.
     * @param res Response object. We set the parameters extracted here.
     * @param next Next handler to call.
     */
    static exportParamsToResLocale(req, res, next) {
        // We check if params were provided inside the URL.
        if (Object.keys(req.params).length !== 0) {
            Params.addLocalParam(res, req.params);
        }
        // We check if params were provided inside the body.
        if (Object.keys(req.body).length !== 0) {
            Params.addLocalParam(res, req.body);
        }

        return next();
    }

    /**
     * Function to add the base parameters into the same place as the additional params.
     *
     * @param res HTTP response object. It will host the added params.
     * @param params Object to add.
     */
    static addLocalParam(res, params) {
        if (!res.locals.params) {
            res.locals.params = params;
        } else {
            // We add the params values into res.locals.params.
            Object.assign(res.locals.params, params);
        }
    }

    /**
     * Function to add parameters that needs to be transmitted between middlewares and controllers.
     *
     * @param res HTTP response object. It will host the added params.
     * @param params Object to add.
     */
    static addMiddlewareParams(res, params) {
        if (!res.locals.additionalParameters) {
            res.locals.additionalParameters = params;
        } else {
            // We add the params values into res.locals.additionalParameters.
            Object.assign(res.locals.additionalParameters, params);
        }
    }

    /**
     * Function used to access added parameters by middlewares.
     *
     * @param res Response object. Variables are stored in res.locals.additionalParameters object.
     * @returns {*}
     */
    static getAddedParams(res) { return res.locals.additionalParameters; }

    /**
     * Function used to access request's parameters.
     *
     * @param res Response object. Variables are stored in res.locals.params object.
     * @returns {*}
     */
    static getRequestParams(res) { return res.locals.params; }
}

export default Params;