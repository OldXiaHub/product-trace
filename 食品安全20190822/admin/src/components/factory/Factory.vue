<template>
  <div>
   <div>
      <!-- 企业详情弹窗 -->
      <el-dialog :visible.sync="dialogTableVisible">
        <div class="table">
          <el-card  class="box-card" v-for="item in factorylist" :key="item.factoryId" style="height:850px">
            <div slot="header" class="clearfix">
             <span>{{item.factoryName}}</span>
            </div>          
          <div v-for="item in factorylist" :key="item.factoryId" class="text item" style="height:150px">
            <p>
            <p style="float:left;line-height:100px;">企业Logo:</p>
            <el-image
              :src="web_static_serve+item.factoryLogo"
              class="image"
              style="width:100px;height:100px;float:left"
              lazy
            ></el-image><p><br/><br/><br/><br/>
            <br/>
            <br/>
            <br/>
            <p>企业名称:{{item.factoryName}}</p><br/>
              <p>企业地址:{{item.factoryAddress}}</p><br/>
               <p>企业电话:{{item.factoryTelphone}}</p> <br/>
                <p>企业法人:{{item.factoryLegalperson}}</p> <br/>
                     <p>企业注册时间:{{item.factoryRegisterTime}}</p> <br/>
                         <p>企业生产许可证:</p>
                         <el-image
                          :src="web_static_serve+item.factoryLicense"
                          class="image"
                          style="width:200px;height:200px;float:left"
                          lazy
                        ></el-image>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    <br/><br/><br/><br/>
                 <p>企业营业执照:</p>
                  <el-image
                    :src="web_static_serve+item.factoryBusinessPhoto"
                    class="image"
                    style="width:200px;height:200px;float:left"
                    lazy
                  ></el-image>
              </div>           
          </el-card>
        </div>
      </el-dialog>
    </div>
    <!-- 添加企业 -->
    <el-dialog title="企业信息" :visible.sync="dialogVisibles" width="40%" >
      <!-- 上传Logo -->
      上传logo：<br>
       <el-upload
        class="upload-demo"
        drag  
        action="http://localhost:80/api/user/upload"
         name="image_header"
        :on-success="addLogophoto"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-form :model="form" status-icon :ref="ruleForm">
        企业名称:
        <el-input type="text" v-model="factoryName"></el-input>
        企业地址:
        <el-input type="text" v-model="factoryAddress" clearable maxlength="11"></el-input>
        企业电话:
        <el-input type="text" v-model="factoryTelphone"></el-input>
        企业法人：
        <el-input type="text" v-model="factoryLegalperson"></el-input>
      </el-form>    
         <br/>
        <!-- 上传营业许可证 -->
      企业营业许可证：<br>
       <div>
          <el-upload
            class="upload-demo"    
            action="http://localhost:80/api/user/upload"
             name="image_header"
            :on-success="addBusinessPhoto"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
        <br/>
        <!-- 上传生产许可证 -->
        企业生产许可证执照：<br>
        <div>
          <el-upload
            class="upload-demo"
            action="http://localhost:80/api/user/upload"
            name="image_header"
            :on-success="addLegalpersonphoto"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
       
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="handleClick()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查询所有企业-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <h3>企业管理</h3>
        </span>
        <div style="margin-top:20px">
          <el-form :inline="true">
            <el-form-item style="float: left;" label="企业名称查询:">
              <el-input v-model="factoryName" placeholder="请输入企业名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit-outline"
                @click="searchfactoryByname(1)"
                style="float: right"
              >搜索</el-button>
            </el-form-item>
             <el-button type="primary" @click="addfactory()" id="addUser" style="float:right">添加</el-button>
          </el-form>
        </div>
      </div>
      <el-table :data="tableData" :key="factoryId" border style="width: 100%" >
       <!-- 所有企业的表格 -->
        <!-- <el-table-column prop="newsId" label="新闻编号" width="140" height="40px"></el-table-column> -->
        <el-table-column label="企业Logo" width=100px>
          <template slot-scope="scope">
          <el-image
              :src="web_static_serve+scope.row.factoryLogo"
              class="image"
              style="width:80px;height:80px;"
              lazy
            ></el-image>
            </template>
            </el-table-column>
        <el-table-column prop="factoryName" label="企业名称" ></el-table-column>
        <el-table-column prop="factoryAddress" label="企业地址" ></el-table-column>
        <el-table-column prop="factoryTelphone" label="企业电话" ></el-table-column>
        <el-table-column prop="factoryRegisterTime" label="企业注册时间" ></el-table-column>
        <el-table-column prop="factoryStatus" label="企业状态" >
          <template slot-scope="scope">
            <div v-if="scope.row.fatoryStatus===1">在售</div>
            <div v-if="scope.row.fatoryStatus===0">注销</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button size="mini" @click="details(scope.row.factoryId)" >查看</el-button>
            <el-button size="mini" @click="handleDelete(scope.row.factoryId)" type="danger">删除</el-button>
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
      web_static_serve:"http://localhost:80/static/",
      lists: [],
      tableData: [],
      orderId: "",
      pz: 4,
      currentPage1: 1, //分页的
      total: 0,
      dialogTableVisible: false,
      dialogVisibles:false,
      factoryName:'',
      factoryAddress:'',
      factoryTelphone:'',
      factoryStatus:'',
      factoryLicense:'',
      factoryLogo:'',
      factoryLegalperson:'',
      factoryBusinessPhoto:'',
      factorylist:[],
      form: {
        factoryName:'',
        factoryAddress:'',
        factoryTelphone:'',
        factoryLegalperson:'',
      }
    };
  },
  created() {
    this.handleCurrentChange(1);
  },
  methods: {
    //上传企业Logo图片
    addLogophoto(response){
       this.factoryLogo = response.data;
      alert(this.factoryLogo);
    },
    //上传企业生产许可证图片
    addLegalpersonphoto(response){
       this.factoryLicense = response.data;
      alert(this.factoryLicense);
    },
    //上传企业营业许可证图片
    addBusinessPhoto(response){
       this.factoryBusinessPhoto = response.data;
      alert(this.factoryBusinessPhoto);
    },
    //分页
    handleSizeChange(val) {
      var self = this;
      console.log(`每页 ${val} 条`);
      self.pz = val;
    },
    handleCurrentChange(val) {
      //查询所有企业
      var self = this;
      this.$axios({
        method: "get",
        url: "http://localhost:80/api/findallfactory",
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
    //模糊查询企业
    searchfactoryByname(val) {
      this.$axios({
        method: "get",
        url: "http://localhost:80/api/findfactorybyname",
        params: {
          pageNum: val,
          pageSize: this.pz,
          factoryName: this.factoryName
        }
      })
        // .then(response => {
        //   let result = response.data;
        //   if ((result.status == 200) & (this.factoryName != null)) {
        //     this.total = result.data.total;
        //     this.tableData = result.data.list; //箭头函数this内部指针 指向外部vue对象
        //     // alert(JSON.stringify(this.tableData))
        //   } else {
        //     alert(result.message);
        //   }
        // })
        .then(response => {
          console.log(JSON.stringify(response));
          var result = response.data;
          if((result.status == 200) & (this.factoryName !=null)){
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
     //添加企业
    addfactory(){
      var self = this;
      self.dialogVisibles = true;
      this.factoryName = "";
      this.factoryAddress = "";
      this.factoryTelphone = "";
      this.factoryLicense="";
    },
    handleClick() {
      var self = this;
      self.dialogVisibles = false;
      this.$axios({
        method: "post",
        url: "http://localhost:80/api/addfactory",
        data: this.$qs.stringify({
          factoryName:this.factoryName,
          factoryTelphone:this.factoryTelphone,
          factoryAddress:this.factoryAddress,
          factoryLegalperson:this.factoryLegalperson,
          factoryLicense:this.factoryLicense,
          factoryLogo:this.factoryLogo,
          factoryBusinessPhoto:this.factoryBusinessPhoto
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
    // 删除企业
    handleDelete(factoryId) {
      this.$confirm("此操作将删除此企业, 是否继续?", "提示", {
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
            url: "http://localhost:80/api/updatefactory",
            params: {
              factoryId: factoryId
            }
          }).then(response => {
            let result = response.data;
            if (result.status == 200) {
              console.log("删除企业成功")
               this.tableData.splice(factoryId, 1);
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
    //跳转到企业详情
    details(factoryId) {
      this.dialogTableVisible = true; //显示弹窗
      //企业详情
      this.$axios({
        method: "get",
        url: "http://localhost:80/api/findfactorybyid",
        params: {
          factoryId:factoryId
        }
      })
        .then(response => {
          let result = response.data;
          if (result.status == 200) {
            this.factorylist = [result.data]; //箭头函数this内部指针 指向外部vue对象
            // alert(JSON.stringify(this.factorylist))
          } else {
            // alert(result.data);
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
