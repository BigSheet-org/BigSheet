/**
 * Function to add parameters in request to transmit object between middlewares and controller.
 * @param req HTTP request.
 * @param params Object who must be added.
 */
export default function requestAddParams(req, params) {
    if (req.body.additionalParameters === undefined) {
        req.body.additionalParameters = params;
    } else {
        // We add the params values into req.body.additionnalParameters.
        Object.assign(req.body.additionalParameters, params);
    }
}