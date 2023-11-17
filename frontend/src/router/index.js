import Routes from "../assets/static/Routes.js";
import User from "../scripts/DAO/User.js";
import Router from './Router.js';

// Init our Router Class
const myRouter = Router.getInstance();
const router = myRouter.router;
// This method allows routes restrictions to users.
// For instance, if they are not authenticated, they cannot access the account route
// If you want to redirect the user to another page, simply return the route path.
// Otherwise, return true.
router.beforeEach((to) => {
    // Redirections from pages that needs an authentication.
    if (!User.isUserConnected() &&
        (to.path === myRouter.routes["compte"].path)) {
        return myRouter.routes["connexion"]
    }

    // Redirections for pages that are not accessible if the user is connected.
    if (User.isUserConnected() &&
        (to.path === myRouter.routes["inscription"].path
            || to.path === myRouter.routes["connexion"].path
        )) {
        return myRouter.routes["home"].path
    }

    return true
})

export default router