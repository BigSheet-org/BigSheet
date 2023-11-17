import User from "../scripts/DAO/User.js";
import {createRouter, createWebHistory} from "vue-router";
import Routes from "../assets/static/Routes.js"

// Init our Router Class
const routesArray = []
for (let attributes in Routes) {
    routesArray.push(Routes[attributes])
}

const router = new createRouter({
    history: createWebHistory(),
    routes: routesArray,                     // Short for routes: routes
});

// This method allows routes restrictions to users.
// For instance, if they are not authenticated, they cannot access the account route
// If you want to redirect the user to another page, simply return the route path.
// Otherwise, return true.
router.beforeEach((to) => {
    // Redirections from pages that needs an authentication.
    if (!User.isUserConnected() &&
        (to.path === Routes.COMPTE.path)) {
        return Routes.CONNEXION.path
    }

    // Redirections for pages that are not accessible if the user is connected.
    if (User.isUserConnected() &&
        (to.path === Routes.INSCRIPTION.path
            || to.path === Routes.COMPTE.path
        )) {
        return Routes.HOME.path
    }

    return true
})

export default router