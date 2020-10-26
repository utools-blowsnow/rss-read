<template>
  <div class="RssArticle">
<!--    <div v-if="item.enclosures" class="left-article-box">-->
<!--      <img :src="item.enclosures" alt="" style="width: 80px;height: 80px">-->
<!--    </div>-->
    <div class="right-article-box">
      <h3 class="title"><a :href="item.link" target="_blank">{{ item.title }}</a></h3>
      <div class="desc" v-html="item.summary"></div>
      <div class="info">
        <span>{{ item.author }} {{ item.categories instanceof Array?item.categories.join(','):item.categories}}</span>
        <span :title="item.pubDate" style="float: right;">{{ timeago(item.pubDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "RssArticle",
  props:['item'],
  computed:{
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
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssArticle{
  display: flex;
  padding: 10px;
  .title{
    margin: 0;
  }
  .right-article-box{
    margin-left: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    word-break: break-all;
    .desc{
      flex: 1;
    }
    .info{
      color: #bcbcbc;
      font-size: 10px;
    }
  }
}
</style>
