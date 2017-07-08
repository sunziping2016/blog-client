<template>
  <page-content>
    <div class="post" v-for="post in posts">
      <h3 class="title" ><router-link exact :to="post.path">{{post.title}}</router-link></h3>
      <div class="author">
        <md-avatar v-if="post.owner.avatar" md-menu-trigger class="md-avatar-icon">
          <img :src="post.owner.avatar" alt="avatar">
        </md-avatar>
        <md-icon v-else>account_circle</md-icon>
        <span>{{post.owner.user}}</span>
      </div>
      <div class="time">
        <md-icon>access_time</md-icon>
        <span>{{post.date.toLocaleString('en', {hour12: false})}}</span>
      </div>
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

<style scoped lang="scss">
.post {
  .title a {
    color: rgba(0, 0, 0, 0.9);
    font-size: 28px;
  }
  .author {
    color: rgba(0, 0, 0, 0.56);
    .md-avatar {
      min-width: 24px;
      min-height: 24px;
      width: 24px;
      height: 24px;
    }
  }
  .time {
    color: rgba(0, 0, 0, 0.56);
  }
}
.post ~ .post {
  margin-top: 40px;
}
</style>
