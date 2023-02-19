import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
    {
        name:"HelloWorld",
        path:"/HelloWorld",
        component:HelloWorld
    }
]
const Router = createRouter({
    history: createWebHashHistory,
    routes: routes
});
export default Router;