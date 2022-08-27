<template>
  <div class="app">
    <div class="left-box">
      <div style="margin: 10px 5px;border-bottom: 1px solid #cdcdcd;">
        <b>订阅列表</b>
        <el-button size="mini" type="primary" icon="el-icon-plus" style="float: right" @click="openAddFeed"></el-button>
      </div>
      <rss-list :systemList="systemList" :list="feeds" :active="active" @clickSite="clickSite" @addFeed="openAddFeed"></rss-list>

    </div>
    <div class="right-box">
        <rss-article-list :list="feeds" :site="active" @changeFeed="onChangeFeed" @changeNotify="onChangeNotify" @deleteFeed="onDeleteFeed" ></rss-article-list>
        <el-backtop target=".right-box"></el-backtop>
    </div>
    <save-feed-dialog ref="addFeedDialog"></save-feed-dialog>
  </div>
</template>

<script>
import RssArticleList from "@/views/RssArticleList";
import RssReader from "@/lib/rssReader";
import SaveFeedDialog from "@/dialog/SaveFeedDialog";
import RssRead from "@/views/RssRead";
import RssList from "@/views/RssList";

const RssFeedEmitter = require('@/lib/rss-feed-emitter/FeedEmitter');
const feeder = new RssFeedEmitter();


const FeedHelp = require('@/lib/FeedHelp');

export default {
  name: 'App',
  components: {RssList, RssRead, SaveFeedDialog, RssArticleList},
  data(){
    return {
      feeds:[],
      systemList: [
        {title: '未读', url: 'unread',badge: 0,list: [],logo: './logo.png',system: true},
        {title: '所有', url: 'all',badge: 0,list: [],logo: './logo.png',system: true},
      ],
      active: {
        list: []
      },
      url: '',

      isInitNotify: false
    }
  },
  watch:{
    feeds:{
      deep: true,
      handler(){
        console.log('change feeds ');
      }
    }
  },
  mounted(){
    FeedHelp.initFeeds(this.eventHandle);

    var feeds = FeedHelp.getLoadFeeds();

    this.feeds = feeds;

    // 首次打开 10秒内不通知
    setTimeout(() => {
      this.isInitNotify = true;
    },10000)
  },
  methods:{
    addFeedItem(feed,item,notify=true){
      var that = this;

      feed.list.unshift(item);
      feed.badge++;

      if (notify && feed.notify){
        if (window.db("notify_" + item.link)){   // 已经阅读过了的
          return;
        }
        let content = '['+feed.title+'] ' + item.title;
        if (window.is_utools){
          utools.showNotification(content)
        }else{
          setTimeout(function (){
            that.$notify.info(content);
          },100)
        }
      }


      window.db("notify_" + item.link,1);
    },

    eventHandle(feed){
      var that = this;
      return function (item){
        if (feed.list === undefined) feed.list = [];

        console.log('eventHandle',feed,item);

        // 刚开始初始化不要通知
        that.addFeedItem(feed,item,this.isInitNotify);
      };
    },


    // 点击订阅的站点，获取订阅的文章列表
    clickSite(item){
      console.log('clickSite',item);
      this.active = item;

      this.$nextTick(()=>{
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      })
    },

    openAddFeed(){
      this.$refs.addFeedDialog.open();
    },
    onChangeNotify(val){
      this.active.notify = val;

      FeedHelp.saveFeedsFromDb()
    },
    onChangeFeed(item){
      this.$refs.addFeedDialog.open(item);
    },
    onDeleteFeed(){
      this.clickSite(this.systemList[0]);
    }
  }
}
</script>

<style lang="stylus">
.app{
  height: 100vh;
  background: #f7f6f4;
  display: flex;
}
.left-box{
  width: 200px;
  /*padding: 10px;*/
  background: #f7f6f4;
  height: 100vh;
  overflow: auto;
  float: left;
  border-right: 1px solid #d7d7d7;

  z-index: 999;

  display: flex;
  flex-direction: column;
}
.left-box .RssList{
  flex: 1;
  overflow: auto;
}
.left-box .rss-foot{
  display: flex;
  justify-content: center;
  padding: 10px;
  border-top: 1px solid lightgrey;
  margin-top: 20px;
}
.left-box .rss-foot i{
  font-size: 20px;
  cursor: pointer;
}
.right-box{
  flex: 1;
  overflow: auto;
}
body{
  margin: 0;
}
</style>
