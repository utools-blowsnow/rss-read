<template>
  <div class="RssSiteList">
    <div v-for="item in list" @click="clickSite(item)">
      <rss-site :item="item" :active="active.url === item.url"></rss-site>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import RssSite from "@/components/RssSite";
export default {
  name: "RssSiteList",
  components: {RssSite},
  props:['list','active'],
  data(){
    return {
    }
  },
  methods: {
    clickSite(item){
      this.$emit('clickSite',item);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssSiteList{
  .RssSite{
    padding: 0 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid lightgrey;
  }
}
</style>
