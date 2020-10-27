<template>
  <div class="RssArticleListView">
    <template v-for="item in list">
      <rss-article :item="item"></rss-article>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
import RssArticle from "@/components/RssArticle";
export default {
  name: "RssArticleListView",
  components: {RssArticle},
  props: ['list']
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssArticleListView {
  .RssArticle{
    border-bottom: 1px solid lightgrey;
    margin-bottom: 30px;
    padding-bottom: 30px;
  }
}
</style>
