import Vue from 'vue';
import VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    component: (resolve) => require(['page/home/home'], resolve),
    children: [
      {
        path: '/customManager/:type', //行业客户管理
        component: (resolve) => require(['page/customManager/industrialCustomer/customManager'], resolve),
      },
      {
        path: '/channelCustomer', //渠道客户
        component: (resolve) => require(['page/customManager/channelCustomer/channelCustomer'], resolve),
      },
      {
        path: '/villageCustomer', //小区客户
        component: (resolve) => require(['page/customManager/villageCustomer/villageCustomer'], resolve),
      },
      {
        path: '/customDesign/:type', //客户定制
        component: (resolve) => require(['page/customDesign/customDesign'], resolve),
      },
      {
        path: '/functionLibrary', //功能仓库
        component: (resolve) => require(['page/productDefinition/functionLibrary'], resolve),
      },
      {
        path: '/menuConfiguration', //产品配套
        component: (resolve) => require(['page/productDefinition/menuConfiguration'], resolve),
      },
      {
        path: '/dataOverView/:type', //数据概览
        component: (resolve) => require(['page/dataAnalysis/dataOverView/dataOverView'], resolve),
      },
      // {
      //     path: '/publicManage',//通知管理
      //     component: resolve => require(['page/publicManage/publicManage'], resolve)
      // },
      {
        path: '/manager', //管理员管理
        component: (resolve) => require(['page/basicConfig/manager/manager'], resolve),
      },
      {
        path: '/salesManagement', //分销销售管理
        component: (resolve) => require(['page/basicConfig/salesManagement/salesManagement'], resolve),
      },
      {
        path: '/agentManagement', //代理商管理
        component: (resolve) => require(['page/basicConfig/agentManagement/agentManagement'], resolve),
      },
      {
        path: '/operationLog', //操作日志
        component: (resolve) => require(['page/operationLog/operationLog'], resolve),
      },
      {
        path: '/authorizationRecord', //授权记录
        component: (resolve) => require(['page/authorizationRecord/authorizationRecord'], resolve),
      },
      {
        path: '/authorizationRecord', //授权记录
        component: (resolve) => require(['page/authorizationRecord/authorizationRecord'], resolve),
      },
      {
        path: '/examineStandard', //审核规范
        component: (resolve) => require(['page/examineStandard/examineStandard'], resolve),
      },
      {
        path: '/potentialCustomer', //潜在客户
        component: (resolve) => require(['page/customManager/potentialCustomer/potentialCustomer'], resolve),
      },
      {
        path: '/deviceUnbind', //设备解绑
        component: (resolve) => require(['page/deviceUnbind'], resolve),
      },
      {
        path: '/inviteCode', //邀请码
        component: (resolve) => require(['page/basicConfig/components/inviteCode'], resolve),
      },
      {
        path: '/publicManage', //推送消息
        component: (resolve) => require(['page/basicConfig/notificationManager/notification'], resolve),
      },
      {
        path: '/dataStatistics', //行业客户管理
        component: (resolve) => require(['page/basicConfig/dataStatistics/dataStatistics'], resolve),
      },
      {
        path: '/toUpgradePopviewList', //升级弹窗
        component: (resolve) => require(['page/basicConfig/toUpgradePopviewManage/toUpgradePopviewList'], resolve),
      },
      {
        path: '/suggestionFeedback', //意见反馈
        component: (resolve) => require(['page/basicConfig/suggestionFeedbackManage/suggestionFeedbackList'], resolve),
      },
      {
        path: '/costStatistics', //费用统计
        component: (resolve) => require(['page/costStatistics/costStatistics'], resolve),
      },
    ],
  },
  {
    path: '/login',
    component: (resolve) => require(['page/login/login'], resolve),
  },
  {
    path: '/401',
    component: (resolve) => require(['page/error_page/401'], resolve),
  },
  {
    path: '/changePwd', //修改密码
    component: (resolve) => require(['page/changePwd/changePwd'], resolve),
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
