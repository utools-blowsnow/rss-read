<template>
  <div class="RssList">
    <div  v-if="list.length > 0">
      <div v-for="item in systemList" @click="clickSite(item)">
        <rss-site :active="active.url === item.url" :item="item"></rss-site>
      </div>
      <div v-for="item in list" @click="clickSite(item)">
        <rss-site :active="active.url === item.url" :item="item"></rss-site>
      </div>
    </div>
    <div v-else>
      <el-result icon="info" title="" subTitle="还没有订阅网站哦，请先添加个订阅">
        <template slot="extra">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="emitAddFeed">订阅网站</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import RssSite from "@/components/RssSite";
export default {
  name: "RssList",
  components: {RssSite},
  props:{
    list: Array,
    active: Object,
    systemList: Array
  },
  watch:{
    list:{
      deep: true,
      handler(){
        // 更新未读的数量
        var badge = 0;
        var list = [];
        var articles = [];
        for (const item of this.list) {
          for (const article of item.list) {
            if (window.db("read_" + article.link) !== 1){
              badge++;
              list.push(article);
            }
          }
        }
        console.log('systemList badge',badge);
        this.systemList[0].badge = badge;
      }
    }
  },
  data(){
    return {
    }
  },
  mounted(){
    // 默认选中未读的
    this.clickSite(this.systemList[0]);
  },
  methods: {
    clickSite(item){
      this.$emit('clickSite',item);
    },
    emitAddFeed(){
      this.$emit('addFeed');
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.RssList {
  .RssSite{
    padding: 5px 10px;
    border-bottom: 1px solid lightgrey;
  }
}
</style>
