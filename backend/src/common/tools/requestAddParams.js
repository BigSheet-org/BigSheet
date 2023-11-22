/**
 * Function to add parameters in request to transmit object between middlewares and controller.
 * @param req HTTP request.
 * @param params Object who must be added.
 */
export default function requestAddParams(req, params) {
    if (req.body.additionnalParameters === undefined) {
        req.body.additionnalParameters = params;
    } else {
        // Add elements who are in params in req.body.additionnalParameters.
        Object.assign(req.body.additionnalParameters, params);
    }
}