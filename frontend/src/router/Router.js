import {createRouter, createWebHistory} from 'vue-router'
import routes from '../assets/static/Routes';

class Router {
    static #instance;
    router;
    routes;
    constructor() {
        this.routes={};
        this.router=new createRouter({
            history: createWebHistory(),
            routes,                     // Short for routes: routes
        });
        
        for (route in routes) {
            this.routes[route.name]=route;
        }
    }

    static getInstance() {
        if (Router.#instance==null) {
            Router.#instance=new Router();
        }
        return Router.#instance;
    }
}
export default Router