<template>
  <div class="app">
    <div class="left-box">
      <div style="margin: 10px 5px;">
        <b>订阅列表</b>
        <el-button size="mini" icon="el-icon-plus" style="float: right" @click="openAddFeed"></el-button>
      </div>
      <rss-site-list :list="feeds" :active="active" @clickSite="clickSite"></rss-site-list>

    </div>
    <div class="right-box">
      <rss-read v-show="url !== ''" :site="active" :url="url" @back="url = ''"></rss-read>
      <rss-article-list v-show="url === ''" :site="active" :list="active.list" :notify="notify"
                        @unsubscribe="removeFeed(active)" @refresh="refreshFeed(active)" @changeNotify="changeNotify"></rss-article-list>
    </div>
    <add-feed-dialog ref="addFeedDialog" @addFeed="addFeed"></add-feed-dialog>
  </div>
</template>

<script>
import RssSiteList from "@/views/RssSiteList";
import RssArticleList from "@/views/RssArticleList";
import RssReader from "@/lib/rssReader";
import AddFeedDialog from "@/dialog/AddFeedDialog";
import RssRead from "@/views/RssRead";

const RssFeedEmitter = require('@/lib/rss-feed-emitter/FeedEmitter');
const feeder = new RssFeedEmitter();

export default {
  name: 'App',
  components: {RssRead, AddFeedDialog, RssArticleList, RssSiteList},
  data(){
    return {
      feeds:[],
      active: {},
      url: '',
      notify: false,

    }
  },
  created(){
    // 全局拦截a标签点击事件
    $("body").off("click","a");
    $("body").on("click","a",(event)=>{
      event.preventDefault();
      let href = event.target.href;
      if (window.is_utools){
        utools.ubrowser.goto(href).run({ width: 1200, height: 600 })
      }else{
        window.open(href)
      }
    })
  },
  mounted(){
    if (window.is_utools){
      utools.onPluginReady(() => {
        this.getFeedsDb();
        this.initFeeds();
      })
    }else{
      this.getFeedsDb();
      this.initFeeds();
    }
  },
  methods:{
    initFeeds(){
      this.active = this.feeds[0];

      for(let feed of this.feeds){
        feeder.add({
          url: feed.url,
          refresh: 60000,
          eventHandle: this.eventHandle(feed)
        });
      }
      feeder.on('load', ({url,items}) => {
        console.log(url,items);
      })
    },
    saveFeedsDb(){
      let newfeeds = [];
      for(let feed of this.feeds){
        let newfeed = {...feed};
        newfeed.badge = 0;
        newfeed.list = [];
        newfeeds.push(newfeed);
      }
      window.db("feeds",newfeeds);
    },
    getFeedsDb(){
      let feeds = window.db("feeds");
      console.log(feeds);
      if (feeds){
        this.feeds = feeds;
      }
    },

    eventHandle(feed){
      var that = this;
      return function (item){
        if (feed.list === undefined) feed.list = [];
        feed.list.unshift(item);
        feed.badge++;
        if (that.notify){
          let content = '['+feed.title+'] ' + item.title;
          if (window.is_utools){
            utools.showNotification(content)
          }else{
            setTimeout(function (){
              that.$notify.info(content);
            },100)
          }
        }
      };
    },

    // event
    clickSite(item){
      console.log('clickSite',item);
      this.active = item;
      this.active.badge = 0;

      this.url = '';
    },
    removeFeed(item){
      feeder.remove(item.url);
      const pos = this.feeds.findIndex((e) => e.url === item.url);
      this.feeds.splice(pos, 1);
      this.active = this.feeds.length > 0 ? this.feeds[0]: {};

      this.saveFeedsDb();
    },
    refreshFeed(item){
      let feed = feeder.findFeed(item);
      feeder.refresh(feed);
    },
    async addFeed(item){
      try {  //捕获验证异常
        await feeder.check(item.url)
      }catch (e){
        this.$alert('订阅地址验证：' + e.message);
        return;
      }
      let feed = {title: item.title, url: item.url,badge: 0,list: []}
      this.feeds.push(feed);
      feeder.add({
        url: item.url,
        refresh: item.refresh?item.refresh:60000,
        eventHandle: this.eventHandle(feed)
      });

      this.saveFeedsDb();
    },
    openAddFeed(){
      this.$refs.addFeedDialog.open();
    },
    changeNotify(val){
      this.notify = val;
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
