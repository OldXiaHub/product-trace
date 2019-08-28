<template>
  <div id="newproduct">
    
        <el-card class="box-card" style="width:1290px;float:left;height:625px;">
          <div slot="header" class="clearfix">
            <span>
              <h3>报表信息</h3>
            </span>
          </div>
          
        </el-card>
      </div>
</template>

<script>
// import { TMap } from "./map";
export default {
  data() {
    return {
      address: "",
      fileList: [],
      hiddenMap: true,
      list: [],
      catename: "",
      formInline: {
        batchName: "",
        batchTime: "",
        batchStatus: '',
        batchProductId: null,
        batchProductName: "",
        batchProductPhoto: "",
        batchProductComment: null,
        batchProductCreateTime: "",
        batchProductQualityTime: "",
        batchFactoryId: null,
        batchStartjiduGeo: 0.0,
        batchStartweiduGeo: 0.0,
        batchEndGeo: 0.0
      }
    };
  },
  created() {},
  mounted() {
    this.createMap();
  },
  methods: {
    insert() {
      this.$axios
        .get("http://localhost:80/Api/insertbatch", {
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
    createMap() {
      TMap("HMBBZ-HI4C4-O7PU7-DDM2K-XKI2S-PTFIN").then(qq => {
        var self = this;
        var center = new qq.maps.LatLng(39.916527, 116.397128);
        var map = new qq.maps.Map(document.getElementById("container"), {
          center: center,
          zoom: 11
        });
        var mapLabel = new qq.maps.Label({
          map: map,
          offset: new qq.maps.Size(10, -50),
          position: center
        });
        var marker = new qq.maps.Marker({
          map: map,
          position: center
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
    getAddressOfMap(mapLabel, location) {
      var self = this;
      new qq.maps.Geocoder({
        complete: function(result) {
          mapLabel.setContent(result.detail.address);
          self.address = result.detail.address;
          console.log(self.formInline);
        }
      }).getAddress(location);
    },

    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 4 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
   
    
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
</style>