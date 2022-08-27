<template>
  <div class="RssArticleListView">
    <div v-if="list.length === 0">
      <el-empty description="暂无文章列表"></el-empty>
    </div>
    <div v-for="item in list" >
      <rss-article :site="site" :item="item"></rss-article>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import RssArticle from "@/components/RssArticle";
export default {
  name: "RssArticleListView",
  components: {RssArticle},
  props: {
    site: Object,
    list: Array,
  },
  methods:{

  }
}
</script>

<style lang="scss" rel="stylesheet/sass">
.RssArticleListView {
  .RssArticle{
    border-bottom: 1px solid lightgrey;
    margin-bottom: 10px;
    padding-bottom: 30px;
    cursor: pointer;
  }
}
</style>
