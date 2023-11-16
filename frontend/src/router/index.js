import {createRouter, createWebHistory} from 'vue-router'
import HomePage from "../views/HomePageView.vue";
import Routes from "../assets/static/Routes.js";
import NotFound from "../views/NotFoundView.vue";
import ConnexionView from "../views/ConnexionView.vue";
import InscriptionView from "../views/InscriptionView.vue";
import CompteView from "../views/CompteView.vue";
import User from "../scripts/DAO/User.js";

const routes = [
    // Home route
    {
        name: Routes.HOME.name,
        path: Routes.HOME.path,
        component: HomePage
    },
    // Connexion route
    {
        name: Routes.CONNEXION.name,
        path: Routes.CONNEXION.path,
        component: ConnexionView
    },
    // Inscription route
    {
        name: Routes.INSCRIPTION.name,
        path: Routes.INSCRIPTION.path,
        component: InscriptionView
    },
    // Compte route
    {
        name: Routes.COMPTE.name,
        path: Routes.COMPTE.path,
        component: CompteView
    },

    // Not found route
    {
        name: Routes.NOT_FOUND.name,
        path: Routes.NOT_FOUND.path,
        component: NotFound
    },
    // For all routes that does not exist, redirecting to 404 page
    {
        path: '/:catchAll(.*)',
        redirect: Routes.NOT_FOUND.path
    }
]

const router = new createRouter({
    history: createWebHistory(),
    routes,                     // Short for routes: routes
})

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
            || to.path === Routes.CONNEXION.path
        )) {
        return Routes.HOME.path
    }

    return true
})

export default router