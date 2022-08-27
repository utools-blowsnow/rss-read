<template>
  <div class="RssArticleList">
      <div class="head-box" style="background: #f2f2f2;">
        <div class="head-site-title">
          {{ site.title }}
        </div>
        <el-button-group>
<!--          <el-button size="mini" type="primary" icon="el-icon-search"></el-button>-->
          <el-button size="mini" type="primary" icon="el-icon-check" @click="emitReadFeed" title="全部已读"></el-button>
          <el-button size="mini" type="primary" icon="el-icon-refresh-right" @click="freshFeed" title="获取当前订阅最新信息"></el-button>
          <template v-if="!site.system">

            <el-button size="mini" type="primary" icon="el-icon-setting" @click="emitChangeFeed"></el-button>

            <el-button v-if="site.notify" size="mini" type="primary"
                       icon="el-icon-bell" @click="emitChangeNotify" title="关闭通知"></el-button>
            <el-button v-if="!site.notify" size="mini" type="info"
                       icon="el-icon-bell" @click="emitChangeNotify" title="开启通知"> </el-button>
            <!--          <el-button size="mini" type="primary" icon="el-icon-star-on"></el-button>-->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="emitUnsubscribe" title="删除订阅"></el-button>
          </template>
        </el-button-group>
      </div>
    <main>
        <rss-article-list-view :site="site" :list="siteArticleList"></rss-article-list-view>
    </main>
  </div>
</template>

<script type="text/ecmascript-6">
import RssArticleListView from "@/views/article_view/RssArticleListView";

const FeedHelp = require('@/lib/FeedHelp');

export default {
  name: "RssArticleList",
  components: {RssArticleListView},
  props: {
    site: Object,
    list: Array
  },
  computed:{
    siteArticleList(){
      var list = [];
      if (this.site.url === 'unread'){
        var temp = [...this.list];
        for (const item of temp) {
          for (const article of item.list) {
            article.site = item;
            if (window.db("read_" + article.link) !== 1) list.push(article);
          }
        }
      }else if (this.site.url === 'all'){
        var temp = [...this.list];
        for (const item of temp) {
          for (const article of item.list) {
            article.site = item;
          }
          list.push(...item.list);
        }
      }else{
        list = [...this.site.list];
        for (const article of list) {
          article.site = this.site;
        }
      }
      return list;
    }
  },
  methods:{
    emitChangeNotify(){
      this.$emit('changeNotify',!this.site.notify);
    },

    emitChangeFeed(){
      this.$emit('changeFeed',this.site);
    },
    emitUnsubscribe(){
      this.$confirm('确认取消订阅?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        FeedHelp.removeFeed(this.site);
        this.$emit('deleteFeed',this.site)
      })
    },

    emitReadFeed(){
      if (this.site.system){   // 系统 全部设置为已读
        for (const item of this.list) {
          for (const article of item.list) {
            window.db("read_" + article.link,1);
          }
          item.badge = 0;
        }
      }else{
        for (const article of this.site.list) {
          window.db("read_" + article.link,1);
        }
        this.site.badge = 0;
      }
    },

    freshFeed(){
      if (this.site.system){   // 系统 刷新所有的订阅
        for (const feed of this.list) {
          FeedHelp.refreshFeed(feed);
        }
      }else{
        FeedHelp.refreshFeed(this.site);
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.RssArticleList {
  .head-box{
    background: rgb(242, 242, 242);
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #cdcdcd;
    padding-right: 10px;
    .head-site-title{
      font-size: 20px;
      margin-left: 10px;
    }
  }
}
</style>
