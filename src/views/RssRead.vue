<template>
  <div class="RssRead">
    <div class="head">
      <div class="head-buttons" style="line-height: 45px;">
        <el-button size="mini" icon="el-icon-back" @click="back">返回</el-button>
      </div>
      <h3>{{ site.title }}</h3>
    </div>
    <main>
      <iframe :src="url" frameborder="0"></iframe>
    </main>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "RssRead",
  props:['site','url'],
  watch: {
    // url(){
    //   //跨域请求内容 赋值
    //   $.get(this.url,(res)=>{
    //     $("iframe").contents().find("html").html(res);
    //   })
    // }
  },
  methods:{
    back(){
      this.$emit('back');
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.RssRead{
  background: #fff;
  .RssArticle{
    border-bottom: 1px solid lightgrey;
  }
  .head{
    margin-bottom: 5px;
    border-bottom: 1px solid lightgrey;
    position: fixed;
    width: calc(100vw - 210px);
    background: #fff;
    padding: 0 20px;
    h3{
      margin: 0;
      padding: 10px 0;
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
  main{
    padding-top: 50px;
    >iframe{
      width: 100%;
      height: calc(100vh - 60px);
    }
  }
}
</style>
