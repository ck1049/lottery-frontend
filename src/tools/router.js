import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorld from '@/components/HelloWorld.vue'
import Home from '@/components/Home.vue'
import Lotto from '@/components/Lotto.vue'
import TwoColorBall from '@/components/TwoColorBall.vue'
const routes = [
    {
        name: "HelloWorld",
        path: "/HelloWorld",
        component: HelloWorld
    },
    {
        name: "Home",
        path: "/home",
        component: Home
    },
    {
        name: "Lotto",
        path: "/lotto/:index(\\d*)",
        component: Lotto
    },
    {
        name: "TwoColorBall",
        path: "/twoColorBall/:index(\\d*)",
        component: TwoColorBall
    }
]
const Router = createRouter({
    history: createWebHashHistory("/lottery-frontend"),
    routes: routes
});
export default Router;