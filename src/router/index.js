import Vue from 'vue';
import VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    component: (resolve) => require(['page/home'], resolve),
    children: [
      // {
      //   path: '/customManager/:type', //行业客户管理
      //   component: (resolve) => require(['page/customManager/industrialCustomer/customManager'], resolve),
      // },
    ],
  },
  {
    path: '/login',
    component: (resolve) => require(['page/login'], resolve),
  },
];
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

export default new VueRouter({
  routes: routes,
});
