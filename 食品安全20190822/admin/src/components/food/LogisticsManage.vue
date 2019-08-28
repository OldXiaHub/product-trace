<template>
  <div>
   <div>
      <!-- 物流信息详情弹窗 -->
      <el-dialog :visible.sync="dialogTableVisible">
        <div class="table">
          <el-card  class="box-card" v-for="item in logisticslist" :key="item.logisticsId" style="height:450px">
            <div slot="header" class="clearfix">
             <span>{{item.logisticsTime}}     当天发货物流信息</span>
            </div>          
          <div v-for="item in logisticslist" :key="item.logisticsId" class="text item" style="height:150px">
            <p>
            <p style="float:left;line-height:10px;">物流订单编号：{{item.logisticsBatchBarcode}}</p>
            <br/>
            <br/>
            <p>发货人：{{item.logisticsStartPerson}}</p><br/>
              <p>发货人电话：{{item.logisticsStartPersonTelphone}}</p><br/>
               <p>发货人地址：{{item.logisticsStartAddress}}</p> <br/>
                <p>接收人电话：{{item.logisticsEndPerson}}</p> <br/>
                     <p>接受人电话：{{item.logisticsEndPersonTelphone}}</p> <br/>
                     <p>接受人地址：{{item.logisticsEndAddress}}</p> <br/>
                        <p>物流信息状态：<br/><br/><template><div v-if="item.logisiticsSignStatus===1">已签收</div><div v-if="item.logisiticsSignStatus===0">未签收</div></template></p>
                        <br/>
              </div>           
          </el-card>
        </div>
      </el-dialog>
    </div>
    <!-- 添加物流 -->
  
    <!-- 查询所有物流信息-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <h3>物流管理</h3>
        </span>
        <div style="margin-top:20px">
          <el-form :inline="true">
            <el-form-item style="float: left;" label="物流查询:">
              <el-input v-model="logisticsBatchBarcode" placeholder="请输入物流订单编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit-outline"
                @click="searchLogisticsBycode(1)"
                style="float: right"
              >搜索</el-button>
            </el-form-item>
             <!-- <el-button type="primary" @click="addfactory()" id="addUser" style="float:right">添加</el-button> -->
          </el-form>
        </div>
      </div>
      <el-table :data="tableData" :key="factoryId" border style="width:100%" >
       <!-- 所有物流的表格 -->
        <el-table-column prop="logisticsTime" label="发货日期" ></el-table-column>
        <el-table-column prop="logisticsBatchBarcode" label="物流订单编号" ></el-table-column>
  
        <el-table-column prop="logisiticsSignStatus" label="物流签收状态" >
          <template slot-scope="scope">
            <div v-if="scope.row.logisiticsSignStatus===1">已签收</div>
            <div v-if="scope.row.logisiticsSignStatus===0">未签收</div>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="200px" >
          <template slot-scope="scope">
            <el-button size="mini" @click="details(scope.row.logisticsId)" >查看</el-button>
            <!-- <el-button size="mini" @click="handleDelete(scope.row.logisticsId)" type="danger">删除</el-button> -->
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
      web_static_serve:"http://10.96.116.248:80/static/",
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
      logisticslist:[],
      logisticsBatchBarcode:'',
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
    //分页
    handleSizeChange(val) {
      var self = this;
      console.log(`每页 ${val} 条`);
      self.pz = val;
    },
    handleCurrentChange(val) {
      //查询所有物流
      var self = this;
      this.$axios({
        method: "get",
        url: "http://10.96.116.248:80/api/querylogis",
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
    //模糊查询物流
    searchLogisticsBycode(val) {
      this.$axios({
        method: "get",
        url: "http://10.96.116.248:80/api/fuzzysearch",
        params: {
          pageNum: val,
          pageSize: this.pz,
          logisticsBatchBarcode: this.logisticsBatchBarcode
        }
      })
        // .then(response => {
        //   console.log(JSON.stringify(response));
        //   var result = response.data;
        //   this.$message({
        //     message: result.status === "200" ? "查询成功" : "查询异常",
        //     type: result.status === "200" ? "success" : "error"
        //   });
        // })
        .then(response => {
          console.log(JSON.stringify(response));
          var result = response.data;
          if((result.status == 200) & (this.logisticsBatchBarcode !=null)){
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
    // 删除
    handleDelete(logisticsId) {
      this.$confirm("此操作将删除此物流信息, 是否继续?", "提示", {
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
            url: "http://10.96.116.248:80/api/updatefactory",
            params: {
              logisticsId: logisticsId
            }
          }).then(response => {
            let result = response.data;
            if (result.status == 200) {
              console.log("删除物流信息成功")
               this.tableData.splice(logisticsId, 1);
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
    //跳转到物流详情
    details(logisticsId) {
      this.dialogTableVisible = true; //显示弹窗
      //物流详情
      this.$axios({
        method: "get",
        url: "http://10.96.116.248:80/api/querylogistics",
        params: {
          logisticsId:logisticsId
        }
      })
        .then(response => {
          let result = response.data;
          if (result.status == 200) {
            this.logisticslist = [result.data]; //箭头函数this内部指针 指向外部vue对象
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
