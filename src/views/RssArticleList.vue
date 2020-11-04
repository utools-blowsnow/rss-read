<template>
  <div class="RssArticleList">
    <div class="head">
      <div class="head-buttons" style="line-height: 45px;">
        通知：
        <el-switch
            v-model="notify"
            @change="changeNotify"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
        <el-button type="danger" size="mini" icon="el-icon-close" @click="unsubscribe"></el-button>
        <el-button  size="mini" icon="el-icon-refresh" @click="refresh"></el-button>

        <el-select v-model="style" placeholder="请选择" size="mini" style="width: 100px;">
          <el-option label="图文列表" value="twlist"></el-option>
          <el-option label="走马灯" value="carousel"></el-option>
        </el-select>
      </div>
      <h3 style="display: inline-block">{{ site.title }}</h3>
      <i class="el-icon-setting" @click="changeFeed"></i>
    </div>
    <main>
      <template v-if="style === 'twlist'">
        <rss-article-list-view :list="list"></rss-article-list-view>
      </template>
      <template v-if="style === 'carousel'">
        <rss-article-carousel-view :list="list"></rss-article-carousel-view>
      </template>
    </main>
  </div>
</template>

<script type="text/ecmascript-6">
import RssArticle from "@/components/RssArticle";
import RssArticleListView from "@/views/article_view/RssArticleListView";
import RssArticleCarouselView from "@/views/article_view/RssArticleCarouselView";
export default {
  name: "RssArticleList",
  components: {RssArticleCarouselView, RssArticleListView, RssArticle},
  props:['list','site','notify'],
  data(){
    return {
      notifys: this.notify,

      style: 'twlist'

    }
  },
  methods:{
    refresh(){
      this.$emit("refresh");
    },
    unsubscribe(){
      this.$confirm('确认取消订阅?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit("unsubscribe");
      })
    },
    changeNotify(val){
      this.$emit("changeNotify",val);
    },
    changeFeed(){
      this.$emit('changeFeed',this.site)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssArticleList{
  background: #fff;

  .head{
    margin-bottom: 5px;
    border-bottom: 1px solid lightgrey;
    position: fixed;
    width: calc(100vw - 210px);
    background: #fff;
    padding: 0 20px;
    h3{
      margin: 0;
      padding: 10px 0;
    }
    .head-buttons{
      float: right;
      line-height: 45px;
      >button{
        line-height: 1;
        margin-left: 10px;
      }
    }
  }
  main{
    padding-top: 50px;
  }
}
</style>
