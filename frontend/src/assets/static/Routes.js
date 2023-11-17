import ConnexionView from "../../views/ConnexionView.vue";
import HomePageView from "../../views/HomePageView.vue";
import InscriptionView from "../../views/InscriptionView.vue";
import CompteView from "../../views/CompteView.vue";
import NotFoundView from "../../views/NotFoundView.vue";

const routes = {
    // Home route
    home: {
        name: "home",
        path: "/",
        component: HomePageView
    },
    // Connexion route
    connexion: {
        name: "connexion",
        path:"/connexion",
        component: ConnexionView
    },
    // Inscription route
    inscription: {
        name: "inscription",
        path: "/inscription",
        component: InscriptionView
    },
    // Compte route
    compte: {
        name: "compte",
        path: "/compte",
        component: CompteView
    },
    // Not found route
    notFound: {
        name: "404",
        path: "/:pathMatch(.*)*",
        component: NotFoundView
    }
};

export default routes;