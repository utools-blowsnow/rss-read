<template>
  <div class="SaveFeedDialog">
    <el-dialog
        title="保存订阅"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="400px">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="订阅名称" required>
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="订阅地址" required>
            <el-input v-model="form.url" placeholder="填写主域名，支持自动发现"></el-input>
          </el-form-item>
          <el-form-item label="刷新周期">
            <el-input v-model="form.refresh" placeholder="单位：毫秒，不填默认 1分钟"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "SaveFeedDialog",
  data(){
    return {
      dialogVisible: false,
      form:{},

      save: false,
      old: {}
    }
  },

  methods:{
    open(params={}){
      this.dialogVisible = true;
      this.form = params;

      this.old = {...params};
      if (params.title) this.save = true;
      else this.save = false;
    },
    close(){
      this.dialogVisible = false;
    },
    submit(){
      if (this.save) this.$emit('saveFeed',{new: this.form, old: this.old});
      else this.$emit('addFeed',this.form);
      this.close();
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.SaveFeedDialog{

}
</style>
