<template>
  <div class="app">
    <div class="left-box">
      <div style="margin: 10px 5px;">
        <b>订阅列表</b>
        <button style="float: right">+</button>
      </div>
      <rss-site-list :list="feeds" :active="active" @clickSite="clickSite"></rss-site-list>
    </div>
    <div class="right-box">
      <rss-article-list :site="active" :list="active.list" @unsubscribe="removeFeed(active)" @refresh="refreshFeed(active)"></rss-article-list>
    </div>
  </div>
</template>

<script>
import RssSiteList from "@/views/RssSiteList";
import RssArticleList from "@/views/RssArticleList";
import RssReader from "@/lib/rssReader";

const RssFeedEmitter = require('@/lib/rss-feed-emitter/FeedEmitter');
const feeder = new RssFeedEmitter();

export default {
  name: 'App',
  components: {RssArticleList, RssSiteList},
  data(){
    return {
      feeds:[
        {title: '异次元', url: 'https://feed.iplaysoft.com/',badge: 0,list: []},
        {title: '小众软件', url: 'https://feeds.appinn.com/appinns/',domain: 'https://appinn.com',badge: 0,list: []},
        {title: '精易论坛', url: 'https://bbs.125.la/forum.php?mod=rss',badge: 0,list: []},
        {title: 'cnBeta', url: 'http://feeds2.feedburner.com/cnbeta_full',badge: 0,list: []},
        {title: '知乎日报', url: 'http://feeds.feedburner.com/zhihu-daily',badge: 0,list: []},
        {title: '知乎每日精选', url: 'https://www.zhihu.com/rss',badge: 0,list: []},
        {title: '知乎每日精选', url: 'https://cn.engadget.com/rss.xml',badge: 0,list: []},
      ],
      active: {},
    }
  },
  created(){
    // 全局拦截a标签点击事件
    $("body").off("click","a");
    $("body").on("click","a",function (event){
      event.preventDefault();
      console.log('click a',event.target.href);
    })
  },
  mounted(){
    this.initFeeds();
  },
  methods:{
    initFeeds(){
      this.active = this.feeds[0];

      for(let feed of this.feeds){
        feeder.add({
          url: feed.url,
          refresh: 60000,
          eventHandle: function (item){
            feed.list.unshift(item);
            feed.badge++;
          }
        });
      }
      feeder.on('load', ({url,items}) => {
        console.log(url,items);
      })
    },




    // event
    clickSite(item){
      this.active = item;
      this.active.badge = 0;
    },
    addFeed(){
      layer.open({
        content: `<input name="订阅名称" type="text">
            <input name="订阅地址" type="text">
            <button>订阅</button>
        `
      })
    },
    removeFeed(item){
      feeder.remove(item.url);
      const pos = this.feeds.findIndex((e) => e.url === item.url);
      this.feeds.splice(pos, 1);
      this.active = this.feeds.length > 0 ? this.feeds[0]: {};
    },
    refreshFeed(item){
      let feed = feeder.findFeed(item);
      feeder.refresh(feed);
    }
  }
}
</script>

<style lang="stylus">
.app{
}
.left-box{
  width: 200px;
  /*padding: 10px;*/
  background: #fff;
  height: 100vh;
  overflow: auto;
  float: left;
  border-right: 1px solid #d7d7d7;

  position: fixed;
  z-index: 999;
}
.right-box{
  width: calc(100vw - 210px);
  margin-left: 200px;
}
body{
  margin: 0;
}
</style>
