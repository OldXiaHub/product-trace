<template>
  <div id="send-box">
    <div id="map-background" :hidden="hiddenMap">
      <div id="container">
        <el-button
          size="medium"
          type="danger"
          style="position:fixed;bottom:10px;right:10px;font-size:15px;z-index:100;"
          @click="hiddenMap=true"
        >确认</el-button>
      </div>
    </div>
    <el-card class="box-card" style="height:900px">
      <div slot="header" class="clearfix">
        <span>
          <h1>食品信息认证</h1>
        </span>
      </div>
      <div>
          <el-form :model="formInline" class="el-form-row">
              <el-form-item label="商品编号">
                <el-input v-model="formInline.batchBarcode" style="width:800px;margin-top:2px"></el-input>
              </el-form-item>
              <el-form-item label="录入批次">
                <el-input v-model="formInline.batchName" style="width:800px;margin-top:2px"></el-input>
              </el-form-item>
              <el-form-item label="商品名称">             
                <el-select style="width:800px;margin-top:2px" v-model="formInline.batchProductName" placeholder="请选择商品">
                <el-option v-for="item in productlist" :key="item.batchId" :label="item.batchProductName" :value="item.batchProductName"></el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="商品图片">     
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
            <el-form-item label="企业名称"> 
                <el-select style="width:800px;margin-top:2px" v-model="formInline.batchFactoryId" placeholder="请选择企业">
                <el-option v-for="item in factorylist" :key="item.factoryId" :label="item.factoryName" :value="item.factoryId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期">
                <el-date-picker
                  value-format="yyyy/MM/dd"
                  type="date"
                  placeholder="选择日期"
                  v-model="formInline.batchProductCreateTime"
                  style="width:800px"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="过期日期">
                <el-date-picker
                  value-format="yyyy/MM/dd"
                  type="date"
                  placeholder="选择日期"
                  v-model="formInline.batchProductQualityTime"
                  style="width:800px"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="生产地址">
                <el-input v-model="formInline.batchStartAddress" style="width:800px;margin-right:10px;"></el-input>
                <el-button size="small" type="primary" plain @click="hiddenMap=false">选择地址</el-button>
              </el-form-item>
              <el-form-item label="商品描述">
                <el-input style="width:800px" :autosize="{ minRows: 5,maxRows: 5}" type="textarea" v-model="formInline.batchProductComment"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="medium"
                  type="primary"
                  style="margin-left:70px;font-size:15px;margin-top:15px"
                  @click="insert()"
                >确认添加</el-button>
                <!-- <el-button
                  size="medium"
                  type="primary"
                  style="margin-left:70px;font-size:15px;margin-top:15px"
                >生成二维码</el-button> -->
              </el-form-item>
          </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { TMap } from "./map";
export default {
  data() {
    return {
      fileList: [],
      hiddenMap: true,
      list: [],
      factorylist:[],
      productlist:[],
      catename: "",
      productPhoto:"",
      formInline: {
        batchName: "",
        batchTime: "",
        factoryName:'',
        batchProductId: "",
        batchProductName: "",
        batchProductPhoto: "",
        batchProductComment: "",
        batchProductCreateTime: "",
        batchProductQualityTime: "",
        batchFactoryId: "",
        batchStartjiduGeo: "",
        batchStartweiduGeo: "",
        batchEndGeo: " ",
        bacthBarcode:'',
        batchStartAddress:'',
        batchBarcode:""
      }
    };
  },
  created() {
    this.factorynames();
    this.productnames();
    this.createMap();
  },
  methods: {
    //添加图片
    addphoto(response){
        this.formInline.batchProductPhoto = response.data;
      alert(this.formInline.batchProductPhoto);
    },
    //查询企业名称
    factorynames() {
      this.$axios
        .get("http://localhost:80/api/findallfactoryname",{
          params: {

          }
        })
        .then(response => {
          let result = response.data;
          if (result.status == 200) {
            this.factorylist=result.data;
            // alert(JSON.stringify(this.factorylist))
            // alert(result.message);
          }
        })
        .catch(error => {
          alert(error);
        });
    },
    //查询商品名称
    productnames(){
      this.$axios
        .get("http://localhost:80/api/querybatchproduct",{
          params: {
          }
        })
        .then(response => {
          let result = response.data;
          if (result.status == 200) {
            this.productlist=result.data;
            // alert(JSON.stringify(productlist))
            // alert(result.message);
          }
        })
        .catch(error => {
          alert(error);
        });
    },
    //添加食品认证
    insert() {
      this.$axios
        .get("http://localhost:80/api/insertbatch", {
          params: this.formInline
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
    //添加地图
    createMap() {
      TMap("HMBBZ-HI4C4-O7PU7-DDM2K-XKI2S-PTFIN").then(qq => {
        var self = this;
        var center = new qq.maps.LatLng(39.916527, 116.397128);
        var map = new qq.maps.Map(document.getElementById("container"), {
          center: center,
          zoom: 11
        });
        var mapLabel = new qq.maps.Label({
          content:"中国北京市北京市东城区丹陛桥",
          map: map,
          offset: new qq.maps.Size(10, -50),
          position: center
        });
        var marker = new qq.maps.Marker({
          map: map,
          position: center,
          animation: qq.maps.MarkerAnimation.DOWN,
        });
        qq.maps.event.addListener(map, "click", function(event) {
          var nowPosition = new qq.maps.LatLng(
            event.latLng.getLat(),
            event.latLng.getLng()
          );
          marker.setPosition(nowPosition);
          mapLabel.setPosition(nowPosition);
          self.getAddressOfMap(mapLabel, nowPosition);
          self.formInline.batchStartweiduGeo = event.latLng.getLat();
          self.formInline.batchStartjiduGeo = event.latLng.getLng();
        });
        // var drivingService = new qq.maps.DrivingService({
        //   map: map
        // });
        // drivingService.setComplete(function(result) {
        //   if (result.type == qq.maps.ServiceResultType.MULTI_DESTINATION) {
        //     //alert("起终点不唯一");
        //     var d = result.detail;
        //     drivingService.search(d.start[0], d.end[0]);
        //   }
        // });
        // drivingService.setError(function(data) {
        //   alert(data);
        // });
        // function search() {
        //   drivingService.setPolicy(qq.maps.DrivingPolicy["LEAST_TIME"]);
        //   drivingService.setLocation("长沙");
        //   drivingService.search("衡阳南站", "衡阳东站");
        // }
        // search();
      });
    },
    //获取地理位置
    getAddressOfMap(mapLabel, location) {
      var self = this;
      new qq.maps.Geocoder({
        complete: function(result) {
          mapLabel.setContent(result.detail.address);
          self.formInline.batchStartAddress = result.detail.address;
          console.log(self.formInline);
        }
      }).getAddress(location);
    },

    // handleExceed(files, fileList) {
    //   this.$message.warning(
    //     `当前限制选择 4 个文件，本次选择了 ${
    //       files.length
    //     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    //   );
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
   
  }
};
</script>


<style scoped>
#map-background {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  z-index: 10;
}
#container {
  position: absolute;
  width: 600px;
  height: 500px;
  top: 20%;
  left: 30%;
  box-shadow: 2px 2px 10px black;
  z-index: 100;
}
/* #send-box
{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 85%;
} */
</style>