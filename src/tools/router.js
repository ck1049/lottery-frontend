import { createRouter, createWebHashHistory } from "vue-router";

const impComp = value => import(`@/components/${value}.vue`);
const routes = [
    {
        name: "HelloWorld",
        path: "/HelloWorld",
        component: () => import('@/components/HelloWorld.vue')
    },
    {
        name: "Home",
        path: "/home",
        component: () => import('@/components/Home.vue')
    },
    {
        name: "Lotto",
        path: "/lotto/:index(\\d*)",
        component: () => import('@/components/Lotto.vue')
    },
    {
        name: "TwoColorBall",
        path: "/twoColorBall/:index(\\d*)",
        component: () => import('@/components/TwoColorBall.vue')
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