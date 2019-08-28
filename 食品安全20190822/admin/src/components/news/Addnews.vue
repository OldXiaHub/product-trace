<template>
  <div id="newproduct">
    <el-card class="box-card" style="height:700px">
      <div slot="header" class="clearfix">
        <span>
          <h1>发布新闻</h1>
        </span>
      </div>
      <div>
        <el-form :model="formInline" class="el-form-row">
              <el-form-item label="新闻标题">
                <el-input v-model="newsName" style="width:800px;margin-top:2px"></el-input>
              </el-form-item>
                <el-form-item label="插入图片">     
              <el-upload
            class="upload-demo"
            drag
            action="http://localhost:80/api/user/upload"
            name="image_header"
            :on-success="addphoto"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <p style="text-align:center;font-size:12px">只能上传jpg/png文件，且不超过500kb</p>
          </el-upload>
           </el-form-item>
              <el-form-item label="新闻内容">
                <el-input style="width:800px" :autosize="{ minRows: 9,maxRows: 9}" type="textarea" v-model="newsContent"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="medium"
                  type="primary"
                  style="margin-left:70px;font-size:15px;margin-top:7px"
                  @click="publishNews()"
                >确认发布</el-button>
              </el-form-item>
          </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newsName:'',
      newsContent:'',
      newsPhoto:'',
      
    };
  },
  created() {},
  mounted() {},
  methods: {
    //插入图片
    addphoto(response){
      this.newsPhoto = response.data;
      alert(this.newsPhoto);
    },
    //发布新闻
    publishNews() {
      this.$axios({
        method: "post",
        url: "http://localhost:80/api/adminnews/insertNews",
        data: this.$qs.stringify({
          newsName:this.newsName,
          newsContent:this.newsContent,
          newsPhoto:this.newsPhoto,
        })
      })
        .then(response => {
          console.log(JSON.stringify(response));
          var result = response.data;
          this.$message({
            message: result.status === "200" ? "添加成功" : "添加失败",
            type: result.status === "200" ? "success" : "error"
          });
        });
    },

  }
};
</script>


<style scoped>

</style>