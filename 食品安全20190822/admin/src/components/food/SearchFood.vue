<template>
  <div id="searchproduct">
    <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <span>
          <h3>食品追溯</h3>
        </span>
      </div>
      <div class="box">
        <div class="block">
          <el-table :data="tableData" border height="480" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="企业名称">
                    <span>{{ props.row.factory.factoryName}}</span>
                  </el-form-item>
                  <el-form-item label="企业电话">
                    <span>{{ props.row.factory.factoryTelphone}}</span>
                  </el-form-item>
                  <el-form-item label="企业地址">
                    <span>{{ props.row.factory.factoryAddress }}</span>
                  </el-form-item>
                  <el-form-item label="企业法人">
                    <span>{{ props.row.factory.factoryLegalperson }}</span>
                  </el-form-item>
                  <el-form-item label="企业营业执照">
                    <el-image
                          :src="web_static_serve+props.row.factory.factoryBusinessPhoto"
                          class="image"
                          style="width:200px;height:200px;margin-left:5px"
                          lazy
                        ></el-image>
                  </el-form-item>                               
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="batchBarcode" label="条形码编号" width="120"></el-table-column>
            <el-table-column label="二维码" width="150">
              <template slot-scope="scope">
                  <img style="width: 100px;height:100px" :src="'http://localhost:80/static/'+scope.row.batchBarcode+'.jpg'"/>
              </template>
            </el-table-column>
            <!-- <el-table-column  prop="batchId" label="批次号" width="120"></el-table-column> -->
            <!-- <el-table-column prop="batchName" label="食品图片" width="120"></el-table-column> -->
            <el-table-column label="食品图片" width="150">
              <template slot-scope="scope">
                  <img style="width: 100px;height:100px" :src="'http://localhost:80/static/'+scope.row.batchProductPhoto"/>
              </template>
            </el-table-column>
            <el-table-column prop="batchProductName" label="食品名称" width="120"></el-table-column>
            <el-table-column prop="batchProductCreateTime" label="生产日期" width="120"></el-table-column>
            <el-table-column  prop="batchProductQualityTime" label="过期日期" width="120"></el-table-column>
            <el-table-column prop="factory.factoryName" label="企业名称" width="120"></el-table-column>
            <el-table-column prop="batchName" label="食品录入批次" width="120"></el-table-column>
            <el-table-column prop="batchTime" label="录入时间" width="120"></el-table-column>
            <!-- <el-table-column prop="batchStatus" label="条形码编号" width="120"></el-table-column> -->
            <!-- <el-table-column prop="batchStatus" label="状态" width="120"></el-table-column> -->
            <el-table-column prop="batchStatus" label="状态" >
          <template slot-scope="scope">
            <div v-if="scope.row.batchStatus===1">有效</div>
            <div v-if="scope.row.batchStatus===0">无效</div>
          </template>
        </el-table-column>
         <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="goMap(scope.row)">食品追溯</el-button>
                <el-button type="danger" size="small" @click="drop(scope.row.batchId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="position:relative;margin-top:20px"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-size="8"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
// import { Loading } from "element-ui";
export default {
  data() {
    return {
      total: 11,
      tableData: [],
      web_static_serve:"http://localhost:80/static/",
    };
  },
  created() {
    this.handleCurrentChange(1);
  },
  methods: {
    goAddPanel() {
      this.$router.push({ path: "/home/sendFood" });
    },
    //查询所有商品
    handleCurrentChange(val) {
      this.$axios
        .get("http://localhost:80/api/queryallbatch", {
          params: {
            pageNum: val,
            pageSize: 5
          }
        })
        .then(response => {
          let result = response.data;
          console.log(JSON.stringify(response));
          if (result.status == 200) {
            this.tableData = result.data.list;
            // alert(JSON.stringify(this.tableData))
          }
        });
    },
    goMap(row) {
      window.sessionStorage.setItem("barCode",row.batchBarcode);
      this.$router.push({ name: "mapcomponent"});
    },
    
    //删除食品认证
    drop(batchId) {
      // alert(batchId)
      this.$confirm("此操作将永久删除该食品信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$axios
            .get("http://localhost:80/api/updatebatch", {
              params: {
                batchId: batchId
              }
            })
            .then(response => {
              let result = response.data;
              if (result.status == 200) {
                // alert(result.message);
                this.tableData.splice(batchId, 1); //动态删除无刷新
                this.handleCurrentChange(1);
              }
            })
            .catch(error => {
              alert(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
 <style>
 .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
