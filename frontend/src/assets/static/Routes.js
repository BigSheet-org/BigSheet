import NotFoundView from "../../views/NotFoundView.vue";
import CompteView from "../../views/CompteView.vue";
import InscriptionView from "../../views/InscriptionView.vue";
import ConnexionView from "../../views/ConnexionView.vue";
import HomePageView from "../../views/HomePageView.vue";
import SheetView from "../../components/sheet/Sheet.vue";

class Routes {

    // Home route
    static HOME = {
        name: "home",
        path: "/",
        component: HomePageView
    };

    // Connexion route
    static CONNEXION = {
        name: "connexion",
        path:"/connexion",
        component: ConnexionView
    };

    // Inscription route
    static INSCRIPTION =  {
        name: "inscription",
        path: "/inscription",
        component: InscriptionView
    };

    // Compte route
    static COMPTE = {
        name: "compte",
        path: "/compte",
        component: CompteView
    };

    // Sheet route
    static SHEET = {
        name: "sheet",
        path: "/sheet",
        component: SheetView
    };

    // Not found route
    static NOT_FOUND = {
        name: "404",
        path: "/:pathMatch(.*)*",
        component: NotFoundView
    };

}

export default Routes;