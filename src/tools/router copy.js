import { createRouter, createWebHashHistory } from "vue-router";

const impComp = value => import(`@/components/${value}.vue`);
const routes = [
    {
        name: "HelloWorld",
        path: "/HelloWorld",
        component: impComp('HelloWorld')
    },
    {
        name: "Home",
        path: "/home",
        component: impComp('Home')
    },
    {
        name: "Lotto",
        path: "/lotto/:index(\\d*)",
        component: impComp('Lotto')
    },
    {
        name: "TwoColorBall",
        path: "/twoColorBall/:index(\\d*)",
        component: impComp('TwoColorBall')
    }
]
const Router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});
Router.beforeEach((to, from, next) => {
    if(to.path.indexOf("home") < 0) {
        
    }
    next();
});
export default Router;