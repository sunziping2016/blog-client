import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import { sync } from 'vuex-router-sync';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import Dropzone from 'vue2-dropzone';
import 'cropperjs/dist/cropper.css';
import components from './components';

sync(store, router);
Vue.use(VueMaterial);
Vue.component('dropzone', Dropzone);
for (let k in components)
  Vue.component(k, components[k]);

(Vue as any).material.registerTheme({
  white: {
    primary: 'white',
    accent: 'blue'
  }
});

function check_router(page) {
  const getters = store.getters;
  if (page.meta.requires_login && !getters.logined)
    return false;
  //noinspection RedundantIfStatementJS
  if (page.meta.requires_admin && !getters.is_admin)
    return false;
  return true;

}

(async () => {
  try {
    await store.dispatch('change_site', location.origin);
    await store.dispatch('check_session');
  } finally {
    let app: any = new Vue({
      el: '#app',
      router,
      store,
      template: '<App :title="title" ref="app"/>',
      components: { App },
      data: {
        title: "xxx 的博客"
      },
      computed: {
        state() {
          return [this.$store.getters.logined, this.$store.getters.is_admin]
        }
      },
      methods: {
        update_title() {
          let meta_title = this.$store.state.route.meta.title;
          if (meta_title)
            document.title = meta_title  + ' - ' + (this as any).title;
          else
            document.title = (this as any).title;
        },
      },
      created() {
        (this as any).update_title();
        if (!check_router(store.state.route))
          router.replace('/');
        this.$watch('state', () => {
          if (!check_router(store.state.route))
            router.push('/');
        });
      },
    });

    router.beforeEach((to, from, next) => {
      Vue.nextTick(() => {
        if (!check_router(to))
          next(false);
        else {
          app.$refs.app.closeSidebar();
          next();
        }
      });
    });

    router.afterEach((to, from) => {
      app.update_title();
    });
  }
})();
