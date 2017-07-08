<template>
  <page-content>
    <div class="post" v-for="post in posts">
      <h3 class="title" ><router-link exact :to="post.path">{{post.title}}</router-link></h3>
      <span class="author"><i class="material-icons">account_circle</i> {{post.owner.user}}</span>
      <span class="author"><i class="material-icons">access_time</i> {{post.date.toLocaleString('en', {hour12: false})}}</span>
    </div>
  </page-content>
</template>

<script lang="ts">
import _ from 'lodash';

export default {
  computed: {
    posts() {
      let post_list = Object.keys(this.$store.state.post.posts).map(pid => {
        let post = this.$store.state.post.posts[pid], owner = this.$store.state.user.users[post.owner];
        owner = _.extend({}, owner, {id: post.owner});
        return {
          id: pid,
          title: post.title,
          date: new Date(post.date * 1000),
          origin_path: post.path,
          path: '/post' + post.path.slice(5),
          owner
        }
      });
      post_list = _.sortBy(post_list, ['date']);
      post_list.reverse();
      return post_list;
    }
  },
  mounted() {
    this.$store.dispatch('update_all_posts')
      .catch(err => this.$root.$refs.app.message(err.message))
  }
};
</script>

<style scoped>
  h3 {
    line-height: 18px;
  }
</style>
