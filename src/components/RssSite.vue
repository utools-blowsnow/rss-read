<template>
  <div class="RssSite" :class="{'active': active}">
    <img class="logo" :src="item.logo || (getDomain(item) + '/favicon.ico')" alt="">
    <span class="title">{{ item.title }}</span>
    <div class="num-box">
      <span class="badge">{{ item.badge > 99 ? '99+': item.badge }}</span>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "RssSite",
  props: ['active','item'],
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
    }
  },
  methods:{}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssSite{
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: space-between;*/
  margin-bottom: 10px;
  list-style: none;
  line-height: 30px;
  cursor: pointer;
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
.RssSiteList img{
  width: 30px;
  height: 30px;
}
.RssSite .logo,.RssSite .title{
  float: left;
}
.RssSite .title{
  margin: 0 5px;
}
.RssSite .num-box{
  float: right;
  .badge{
    background: #bcbcbc;
  }
}
</style>
