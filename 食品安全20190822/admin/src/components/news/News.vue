<template>
  <div>
    <div>
      <!-- 订单详情弹窗 -->
      <el-dialog :visible.sync="dialogTableVisible">
        <div class="table">
          <el-card v-for="item in lists" :key="item.newsId" class="box-card" >
            <div slot="header" class="clearfix">
              <span>{{item.newsName}}</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <div v-for="item in lists" :key="item.newsId" class="text item" style="height:150px">
              <el-image
              :src="web_static_serve+item.newsPhoto"
              class="image"
              style="width:170px;height:150px;float:left"
              lazy
            ></el-image>
              {{item.newsContent}}
              </div>
          </el-card>
         
          <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="sent()">发货</el-button>
            <el-button>
              <a :href="'http://www.wxhwg.com:8080/mock/order/export?orderid='+this.form.orderid">导出</a>
            </el-button>
          </div> -->
        </div>
      </el-dialog>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <h3>新闻管理</h3>
        </span>
        <div style="margin-top:20px">
          <el-form :inline="true">
            <el-form-item style="float: left;" label="新闻名称查询:">
              <el-input v-model="newsName" placeholder="请输入新闻标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit-outline"
                @click="queryNewsByName(1)"
                style="float: right"
              >搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <!-- 所有新闻的表格 -->
        <!-- <el-table-column prop="newsId" label="新闻编号" width="140" height="40px"></el-table-column> -->
        <el-table-column prop="newsName" label="新闻标题" ></el-table-column>
        <!-- <el-table-column prop="newsContent" label="新闻内容" height="40"></el-table-column> -->
        <!-- <el-table-column prop="newsPhoto" label="新闻图片" ></el-table-column> -->
        <el-table-column prop="newsStatus" label="新闻状态" >
          <template slot-scope="scope">
            <div v-if="scope.row.newsStatus===1">有效</div>
            <div v-if="scope.row.newsStatus===0">无效</div>
          </template>
        </el-table-column>
        <el-table-column prop="newsTime" label="发布时间" ></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button @click="details(scope.row.newsId);" type="text" size="small">查看</el-button>
            <el-button @click="handleDelete(scope.row.newsId)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage1"
          :page-sizes="[8, 16, 24, 32]"
          :page-size="pz"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "order",
  data() {
    return {
      lists: [],
      tableData: [],
      orderId: "",
      pz: 7,
      currentPage1: 1, //分页的
      total: 0,
      dialogTableVisible: false,
      web_static_serve:"http://localhost:80/static/",
      newsName:'',
      form: {
        newsId: "",
        newsName:"",
        newsContent:"",
        newsPhoto:"",
        newsTime:"",
        newsStatus:""
      }
    };
  },
  created() {
    this.handleCurrentChange(1);
  },
  methods: {
    //分页
    handleSizeChange(val) {
      var self = this;
      console.log(`每页 ${val} 条`);
      self.pz = val;
    },
    handleCurrentChange(val) {
      //查询所有新闻
      var self = this;
      this.$axios({
        method: "get",
        url: "http://localhost:80/api/adminnews/selectApi",
        params: {
          pageNum: val,
          pageSize: self.pz
        }
      })
        .then(response => {
          // alert(herf);
          let result = response.data;
          if (result.status == 200) {
            self.total = result.data.total;
            self.tableData = result.data.list; //箭头函数this内部指针 指向外部vue对象
          } else {
            alert(result.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //根据新闻标题查询新闻
    queryNewsByName(val) {
      this.$axios({
        method: "get",
        url: "http://localhost:80/api/adminnews/querynewslike",
        params: {
          pageNum: val,
          pageSize: this.pz,
          newsName: this.newsName
        }
      })
        // .then(response => {
        //   let result = response.data;
        //   if ((result.status == 200) & (this.newsName!=null)) {
        //     this.total = result.data.total;
        //     this.tableData = result.data.list; //箭头函数this内部指针 指向外部vue对象
        //   } else {
        //     alert(result.message);
        //   }
        // })
        .then(response => {
          console.log(JSON.stringify(response));
          var result = response.data;
          if((result.status == 200) & (this.newsName !=null)){
            this.total = result.data.total;
            this.tableData = result.data.list;
          }
          this.$message({
            message: result.status === "200" ? "查询成功" : "查询异常",
            type: result.status === "200" ? "success" : "error"
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
   
    handleDelete(newsId) {
      // 删除新闻
      this.$confirm("此操作将删除此新闻, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$axios({
            method: "get",
            url: "http://localhost:80/api/adminnews/delnews",
            params: {
              newsId: newsId
            }
          }).then(response => {
            let result = response.data;
            if (result.status == 200) {
              console.log("删除新闻成功")
              this.tableData.splice(newsId, 1);
              this.handleCurrentChange(1); //删除数据，更新视图
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //跳转到新闻详情
    details(newsId) {
      this.dialogTableVisible = true; //显示弹窗
      //新闻详情
      this.$axios({
        method: "get",
        url: "http://localhost:80/Api/food/queryNewsDetail",
        params: {
          newsId: newsId
        }
      })
        .then(response => {
          let result = response.data;
          if (result.status == 200) {
            this.lists = result.data; //箭头函数this内部指针 指向外部vue对象
            this.form.newsId = newsId;
            // alert(JSON.stringify(this.lists))
          } else {
            alert(result.data);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  }
};
</script>

<style>

</style>
