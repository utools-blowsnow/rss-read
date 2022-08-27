<template>
  <div class="RssArticle" :class="{'read': isRead}" @click="readArticle(item)">
<!--    <div v-if="item.enclosures" class="left-article-box">-->
<!--      <img :src="item.enclosures" alt="" style="width: 80px;height: 80px">-->
<!--    </div>-->
    <el-badge is-dot class="item" :hidden="isRead" style="width: 100%;">
      <div class="info" style="margin-left: 40px;">
        <span>{{ item.site.title }}</span>
        <span :title="item.pubDate" style="float: right;">{{ timeago(item.pubDate) }}</span>
      </div>
      <div class="article-info-box">
        <img style="width: 30px; height: 30px;" :src="item.site.logo || (getDomain(item.site) + '/favicon.ico')" alt="">
        <div class="right-article-box">
          <h3 class="title">{{ item.title }}</h3>
          <div class="desc" v-html="item.summary"></div>
        </div>
        <img v-if="enclosures" :src="enclosures" alt="" style="width: 80px;height: 80px">
      </div>
    </el-badge>

  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "RssArticle",
  props: {
    item: Object,
    site: Object
  },
  data(){
    return {
      isRead: false
    }
  },
  watch:{
    site:{
      deep: true,
      handler(){
        this.isRead = window.db("read_" + this.item.link);
      }
    }
  },
  computed:{
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
    timeago(){   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
      return function (dateTimeStamp){
          // dateTimeStamp = Date.parse(dateTimeStamp.replace(/-/gi, "/"));
          var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
          var hour = minute * 60;
          var day = hour * 24;
          var week = day * 7;
          var halfamonth = day * 15;
          var month = day * 30;
          var now = new Date().getTime();   //获取当前时间毫秒

          var diffValue = now - dateTimeStamp;//时间差

          if(diffValue < 0){
            return;
          }
          var minC = diffValue/minute;  //计算时间差的分，时，天，周，月
          var hourC = diffValue/hour;
          var dayC = diffValue/day;
          var weekC = diffValue/week;
          var monthC = diffValue/month;
          var result = "";
          if(monthC >= 1){
            result = parseInt(monthC) + "月前"
          }else if(weekC >= 1){
            result = parseInt(weekC) + "周前"
          }else if(dayC >= 1){
            result = parseInt(dayC) + "天前"
          }else if(hourC >= 1){
            result = parseInt(hourC) + "小时前"
          }else if(minC >= 1){
            result = parseInt(minC) + "分钟前"
          }else if(diffValue >= 0 && diffValue <= minute){
            result = "刚刚"
          }else {
            var datetime = new Date();
            datetime.setTime(dateTimeStamp);
            var Nyear = datetime.getFullYear();
            var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
            var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
            var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
            var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
            result = Nyear + "-" + Nmonth + "-" + Ndate
          }
          return result;
      }
    },
    enclosures(){
      if (this.item.enclosures && this.item.enclosures.length > 0) return this.item.enclosures[0].url;
      return null;
    },
  },
  mounted(){
    this.isRead = window.db("read_" + this.item.link);
  },
  methods:{
    readArticle(item){
      // 记录已读
      window.db("read_" + item.link,1);
      this.site.badge--;

      this.isRead = true;

      console.log('readArticle',window.db("read_" + item.link));

      if (window.is_utools){
        utools.ubrowser.goto(item.link).run({ width: 1200, height: 600 })
      }else{
        window.open(item.link)
      }
    }
  }
}
</script>

<style lang="scss" rel="  stylesheet/sass">
.RssArticle{

  padding: 10px;

  .info{
    color: #bcbcbc;
    font-size: 10px;
  }

  .article-info-box{
    display: flex;
    .right-article-box{
      margin-left: 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      word-break: break-all;
      .title{
        margin: 2px 0;
        font-size: 17px;
        color: #333;
      }
      .desc{
        flex: 1;
        font-size: 12px;
        color: #a5a5a5;
        img{
          max-width: 100%;
        }
      }
      .info{
        color: #bcbcbc;
        font-size: 10px;

      }
    }
  }
}
.RssArticle.read{
  .title{
    color: #8b8b8b!important;
  }
}
</style>
