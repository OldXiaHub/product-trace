<template>
  <div>
      <!-- 修改受理状态 -->
    <el-dialog title="投诉信息" :visible.sync="dialogVisible"  width="30%" >
      <el-card class="box-card" v-for="item in complainList" :key="item.complainId">
      <div v-for="item in complainList" :key="item.complainId" class="text item">
          投诉标题：  &nbsp;&nbsp;{{item.complainName }}<br/><br/>
          投诉内容：  &nbsp;&nbsp;{{item.complainContent }}<br/><br/>
          投诉人姓名：{{item.user.nickName }} <br/><br/>
          投诉人电话：{{item.complainUserTelphone}}
      </div>
      <br>
      <el-form :model="form" >
          <el-form-item label="进行受理："> 
                <el-select  v-model="complainStatus" placeholder="请选择受理状态">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
      </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer" v-for="item in complainList" :key="item.complainId" >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateComplaint(item.complainId)">确 定</el-button>
      </div>  
    </el-dialog>
    <!-- 查询所有 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <h3>投诉查询</h3>
        </span>
        <div style="margin-top:20px">
          <el-form :inline="true">
            <el-form-item style="float: left;" label="投诉查询:">
              <el-input v-model="complainContent" placeholder="请输入投诉内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit-outline"
                @click="searchComplaintByname(1)"
                style="float: left"
              >搜索</el-button>
            </el-form-item>
            <!-- <el-button type="primary" @click="addfactory()" id="addUser" style="float:right">添加</el-button> -->
          </el-form>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <!-- 所有投诉的表格 -->
        <!-- <el-table-column prop="complainName" label="投诉标题" ></el-table-column> -->
        <el-table-column prop="complainContent" label="投诉内容" ></el-table-column>
        <el-table-column prop="user.nickName" label="投诉人姓名" ></el-table-column>
        <el-table-column prop="complainUserTelphone" label="投诉人电话" ></el-table-column>
        <el-table-column prop="complainStatus" label="投诉受理状态" >
          <template slot-scope="scope">
            <el-steps :space="60" :active="scope.row.complainStatus" finish-status="success">
            <el-step title="待受理" style=""></el-step>
            <el-step title="进行中"></el-step>
            <el-step title="已受理"></el-step>
          </el-steps>
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="left" width="152px" >    
            <template slot-scope="scope">
            <el-button size="mini" style="margin:auto 0" @click="queryDetail(scope.row.complainId)">查看</el-button>
            <!-- <el-button size="mini" type="danger" @click="delFactory(scope.$index,tableData)">删除</el-button> -->
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
      factorylist:[],
      value: '',
      pz: 6,
      currentPage1: 1, //分页的
      complainList:"",
      total: 0,
      dialogTableVisible: false,
      dialogVisibles: false,
      visible: false,
      dialogVisible: false,
      factoryName:'',
      factoryAddress:'',
      factoryTelphone:'',
      factoryStatus:'',
      complainStatus:'',
      complaintName:'',
      complainContent:'',
      form: {
        factoryId:'',
        factoryName:'',
        factoryAddress:'',
        factoryTelphone:'',
        factoryStatus:'',
        complainStatus:''
      },
      options: [{
          value: 0,
          label: '待受理'
        }, {
          value: 1,
          label: '进行中'
        }, {
          value: 2,
          label: '已受理'
        }  
        ],
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
    //查询所有投诉
    handleCurrentChange(val) {
      var self = this;
      this.$axios({
        method: "get",
        url: "http://localhost:80/api/adminlog/querycomplain",
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
            // alert(JSON.stringify(self.tableData))
          } else {
            alert(result.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //模糊查询投诉
    searchComplaintByname(val) {
      this.$axios({
        method: "get",
        url: "http://localhost:80/api/adminlog/fuzzycomplain",
        params: {
          pageNum: val,
          pageSize: this.pz,
          complainContent: this.complainContent
        }
      })
        // .then(response => {
        //   let result = response.data;
        //   if ((result.status == 200) & (this.complainContent !=null)) {
        //     this.total = result.data.total;
        //     this.tableData = result.data.list; //箭头函数this内部指针 指向外部vue对象
        //     // alert(JSON.stringify(this.tableData))
        //   } else {
        //     alert(result.message);
        //   }
        // })
        .then(response => {
          var result = response.data;
          if((result.status == 200) & (this.complainContent !=null)){
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
    //查询投诉详情
    queryDetail(complainId){
      this.dialogVisible=true;
      this.$axios({
        method: "get",
        url: "http://localhost:80/api/adminlog/querycomplainById",
        params: {
          complainId:complainId
        }
      })
        .then(response => {
          let result = response.data;
          if (result.status == 200) {
            this.complainList = [result.data]; //箭头函数this内部指针 指向外部vue对象
            // alert(JSON.stringify(this.complainList))
          } else {
            alert(result.message);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //受理投诉状态
    updateComplaint(complainId){
        // alert(complainId)
        // alert(this.complainStatus)
        this.dialogVisible=false;
           this.$axios({
        method: "post",
        url: "http://localhost:80/api/adminlog/accept",
        data: this.$qs.stringify({
          complainId:complainId,
          complainStatus:this.complainStatus,
        })
      })
        .then(response => {
          console.log(JSON.stringify(response));
          var result = response.data;
          this.$message({
            message: result.status === "200" ? "受理成功" : "受理失败",
            type: result.status === "200" ? "success" : "error"
          });
          this.handleCurrentChange(1);
        });

    }
  }
};
</script>

<style >
 .text {
    font-size: 14px;
  }
</style>
