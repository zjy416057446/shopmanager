import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import home from '@/components/home';
import users from '@/components/users';

Vue.use(Router);

export default new Router({
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
    }],
  }],
});
