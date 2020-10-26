<template>
  <div class="AddFeedDialog">
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "AddFeedDialog",
  data(){
    return {
      dialogVisible: false
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.AddFeedDialog{

}
</style>
