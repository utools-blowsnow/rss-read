<template>
  <div class="RssSite" :class="{'active': active}">
    <img class="logo" :src="item.logo || (getDomain(item) + '/favicon.ico')" alt="">
    <span class="title">{{ item.title }}</span>
    <div v-show="badge > 0" class="num-box">
      <span class="badge">{{ badge }}</span>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "RssSite",
  props: {
    active: Boolean,
    item: Object
  },
  data(){
    return {
      badge: 0
    }
  },
  watch:{
    item:{
      deep: true,
      handler(){
        this.badge = this.calcBadge();
      }
    }
  },
  mounted(){
    this.badge = this.calcBadge();
  },
  computed: {
    getDomain(){
      return function (item){
        if (item.domain) return item.domain;
        var domain = item.url.split('/'); //以“/”进行分割
        if(domain[2]) {
          return domain[0] + '//' + domain[2];
        }else{
          return item.url;
        }
      }
    },
  },
  methods:{
    calcBadge(){
      if (this.item.system){
        return this.item.badge;
      }
      var badge = 0;
      console.log('calc read',this.item);
      for (const article of this.item.list) {
        console.log('calc read',window.db("read_" + article.link));
        if (window.db("read_" + article.link) !== 1){
          badge++;
        }
      }

      return badge;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssSite{
  list-style: none;
  line-height: 30px;
  cursor: pointer;

  position: relative;
}
.RssSite:hover,.RssSite.active{
  background: #eae9e7;
}
.RssSite:before{
  content: ' ';
  height: 100%;
  width: 5px;
  display: list-item;
}
.RssSite.active:before{
  content: ' ';
  height: 30px;
  width: 3px;
  background: #3d69ec;
  display: list-item;
  position: absolute;
  left: 2px;
}
.RssSite img{
  width: 30px;
  height: 30px;
}
.RssSite .logo,.RssSite .title{
  float: left;
}
.RssSite .title{
  margin: 0 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100px;
}
.RssSite .num-box{
  float: right;
  .badge{
    background: #bcbcbc;
  }
}
</style>
