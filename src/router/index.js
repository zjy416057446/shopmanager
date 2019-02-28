import Vue from 'vue';
import Router from 'vue-router';
import {
  Message
} from 'element-ui';
import login from '@/components/login';
import home from '@/components/home';
import users from '@/components/users';
import rights from '@/components/rights';
import roles from '@/components/roles';


Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: login,
  }, {
    path: '/',
    name: 'home',
    component: home,
    children: [{
        path: '/users',
        name: 'users',
        component: users,
      },
      {
        path: '/rights',
        name: 'rights',
        component: rights,
      },
      {
        path: '/roles',
        name: 'roles',
        component: roles,
      }
    ],
  }],
});


router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.name === "login") {
    next()
  } else {
    // 如果要去的不是登录  ->
    // console.log(11111)
    const token = localStorage.getItem("token");
    // console.log(token)
    // if !token ->渲染login
    if (!token) {
      // 提示
      // this.$message.warning("请先登录");
      Message.warning("请先登录");
      // alert("")
      router.push({
        name: 'login'
      })
      return;
    }
    //  if token 渲染home
    next()
  }
})

export default router;
