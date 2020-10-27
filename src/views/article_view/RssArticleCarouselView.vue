<template>
  <div class="RssArticleCarouselView">
    <el-carousel height="calc(100vh - 60px)" width="calc(100vw - 240px)" :autoplay="false" direction="vertical">
      <el-carousel-item v-for="item in list">
        <rss-article :item="item"></rss-article>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script type="text/ecmascript-6">
import RssArticle from "@/components/RssArticle";
export default {
  name: "RssArticleCarouselView",
  components: {RssArticle},
  props: ['list']
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssArticleCarouselView {
  .el-carousel__container{
    width: calc(100vw - 240px);
    overflow: auto;
  }
  .el-carousel__item{
    overflow: auto;
  }
  .el-carousel__indicators{
    background: black;
    height: calc(100vh - 60px);
    overflow: auto;
  }
}
</style>
