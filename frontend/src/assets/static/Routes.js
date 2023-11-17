const routes = [
    // Home route
    {
        name: "home",
        path: "/",
        component: HomePage
    },
    // Connexion route
    {
        name: "connexion",
        path: "/connexion",
        component: ConnexionView
    },
    // Inscription route
    {
        name: "inscription",
        path: "/inscription",
        component: InscriptionView
    },
    // Compte route
    {
        name: "compte",
        path: "/compte",
        component: CompteView
    },

    // Not found route
    {
        name: "404",
        path: "/:pathMatch(.*)*",
        component: NotFound
    }
];

export default routes;