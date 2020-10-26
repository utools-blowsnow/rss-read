<template>
  <div class="RssArticleList">
    <div class="head">
      <div class="head-buttons" style="line-height: 45px;">
        <button @click="unsubscribe">取消订阅</button>
        <button @click="refresh">刷新</button>
      </div>
      <h3>{{ site.title }}</h3>
    </div>
    <main>
      <rss-article v-for="(item,index) in list" :item="item" :key="index"></rss-article>
    </main>
  </div>
</template>

<script type="text/ecmascript-6">
import RssArticle from "@/components/RssArticle";
export default {
  name: "RssArticleList",
  components: {RssArticle},
  props:['list','site'],
  methods:{
    refresh(){
      this.$emit("refresh");
    },
    unsubscribe(){
      this.$emit("unsubscribe");
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssArticleList{
  background: #fff;
  transform: scale3d(1, 1, 1);
  .RssArticle{
    border-bottom: 1px solid lightgrey;
  }
  .head{
    margin-bottom: 5px;
    border-bottom: 1px solid lightgrey;
    h3{
      margin: 0;
      padding: 10px 20px;
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
}
</style>
