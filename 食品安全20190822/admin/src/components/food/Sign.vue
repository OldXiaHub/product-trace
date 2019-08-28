<template>
  <div>
    <div id="map-background" :hidden="hiddenMap">
      <div id="container">
        <el-button
          size="medium"
          type="danger"
          style="position:absolute;bottom:10px;right:10px;font-size:15px;z-index:100;"
          @click="hiddenMap=true"
        >确认</el-button>
      </div>
    </div>
    <div style="font-size:20px;width:20%;" :hidden="!signStatus">
      <!-- 签到成功
      <span style="font-size:20px;margin:320px auto;text-align:center;color:#0000ff">(2秒后返回)</span>-->
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
          <span>物流信息</span>
        </div>
        <el-form ref="form" :model="form" class="el-form-row">
          <el-form-item label="发货日期" style="">
            <el-date-picker
              disabled
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy.MM.dd"
              type="date"
              placeholder="选择日期"
              v-model="form.logisticsTime"
              style="width:500px;margin-top:2px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="批次编号">
            <el-input disabled v-model="form.logisticsBatchBarcode" style="width:500px;margin-top:2px" ></el-input>
          </el-form-item>
          <el-form-item label="签收地址">
            <el-input disabled v-model="form.logisticsStartAddress" style="width:500px;margin-top:2px"></el-input>
          </el-form-item>
          <el-form-item label="本站签收人">
            <el-input v-model="form.logisticsEndPerson"></el-input>
          </el-form-item>
          <el-form-item label="签收人电话">
            <el-input v-model="form.logisticsEndPersonTelphone"></el-input>
          </el-form-item>
          <el-form-item label="下一站地址">
            <el-input v-model="form.logisticsEndAddress"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createLogistics()">立即创建</el-button>
            <el-button size="small" type="primary" plain @click="hiddenMap=false">选择地址</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div
      style="font-size:40px;text-align:center;width:250px;position:absolute;top:50%;left:50%"
      id="qrcode"
      :hidden="signStatus"
    >
      <div style="font-size:30px;margin-bottom:20px;color:#0000ff">扫码签收</div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import { TMap } from "./map";
export default {
  data() {
    return {
      hiddenMap: true,
      logistics: JSON.parse(window.sessionStorage.getItem("logistics")),
      form: {},
      time: {},
      signStatus: false
    };
  },
  created() {
    this.$nextTick(function() {
      this.createQRCode();
    });
    this.checkStatus();
    this.form = {
      // logisticsId: "",
      logisticsTime: new Date(),
      logisticsBatchBarcode: this.logistics.logisticsBatchBarcode,
      logisticsStartPerson: this.logistics.logisticsEndPerson,
      logisticsStartPersonTelphone: this.logistics.logisticsEndPersonTelphone,
      logisticsStartAddress: this.logistics.logisticsEndAddress,
      logisticsEndPerson: "",
      logisticsEndPersonTelphone: "",
      logisticsEndAddress: "",
      logisticsStartjingduGeo: this.logistics.logisticsEndjingduGeo,
      logisticsStartWeiduGeo: this.logistics.logisticsEndweiduGeo,
      logisticsEndjingduGeo: 0,
      logisticsEndweiduGeo: 0,
      logisiticsSignStatus: 0,
      logisiticsCarjingduGeo: this.logistics.logisticsEndjingduGeo,
      logisiticsCarweiduGeo: this.logistics.logisticsEndweiduGeo
    };
  },
  mounted() {
    this.time = setInterval(this.checkStatus, 5000);
    this.createMap();
  },
  beforeDestroy() {
    clearInterval(this.time);
  },
  methods: {
    createQRCode() {
      var qrCode = new QRCode("qrcode", {
        width: 250,
        height: 250,
        text: `http://10.96.4.208:80/api/updatestatus?logisticsId=${
          JSON.parse(window.sessionStorage.getItem("logistics")).logisticsId
        }`, // 二维码内容
        foreground: "#ff0"
      });
    },
    checkStatus() {
      this.$axios
        .get("http://localhost:80/api/querylogistics", {
          params: {
            logisticsId:
              JSON.parse(window.sessionStorage.getItem("logistics")).logisticsId || ""
          }
        })
        .then(response => {
          console.log(JSON.stringify(response));
          let result = response.data;
          if (result.status == 200) {
            if (result.data && result.data.logisiticsSignStatus == 1) {
              clearInterval(this.time);
              this.signStatus = true;
              var self = this;
            }

            // setTimeout(function() {
            //   console.log(1);
            //   self.$router.go(-1);
            // }, 2000);
          }
        });
    },
    createMap() {
      TMap("HMBBZ-HI4C4-O7PU7-DDM2K-XKI2S-PTFIN").then(qq => {
        var self = this;
        var center = new qq.maps.LatLng(
          this.form.logisiticsCarweiduGeo,
          this.form.logisiticsCarjingduGeo
        );
        console.log(center);
        var map = new qq.maps.Map(document.getElementById("container"), {
          center: center,
          zoom: 8
        });
        var mapLabel = new qq.maps.Label({
          content: self.form.logisticsStartAddress,
          map: map,
          offset: new qq.maps.Size(10, -50),
          position: center
        });
        var marker = new qq.maps.Marker({
          map: map,
          position: center,
          animation: qq.maps.MarkerAnimation.DOWN
        });
        qq.maps.event.addListener(map, "click", function(event) {
          var nowPosition = new qq.maps.LatLng(
            event.latLng.getLat(),
            event.latLng.getLng()
          );
          marker.setPosition(nowPosition);
          mapLabel.setPosition(nowPosition);
          self.getAddressOfMap(mapLabel, nowPosition);
          self.form.logisticsEndweiduGeo = event.latLng.getLat();
          self.form.logisticsEndjingduGeo = event.latLng.getLng();
        });
      });
    },
    getAddressOfMap(mapLabel, location) {
      var self = this;
      new qq.maps.Geocoder({
        complete: function(result) {
          mapLabel.setContent(result.detail.address);
          self.form.logisticsEndAddress = result.detail.address;
          console.log(self.form.logisticsEndAddress);
        }
      }).getAddress(location);
    },
    createLogistics() {
      console.log(this.form);
      this.$axios
        .get("http://localhost:80/api/insertlogistics", {
          params:this.form
        })
        .then(response => {
          console.log(JSON.stringify(response));
          let result = response.data;
          this.$message({
            message:
              result.status == 200 ? "添加成功，3秒后跳转页面" : "添加失败",
            type: result.status == 200 ? "success" : "error"
          });
          if (result.status == 200) {
            var self = this;
            setTimeout(function() {
              self.$router.go(-1);
            }, 2000);
          }
        });
    }
  }
};
</script>
<style scoped>
#qrcode {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.item {
  margin-bottom: 18px;
}

/* .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  } */

.box-card {
  width: 700px;
  height: 600px;
}
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
  height:350px;
  top: 20%;
  left: 30%;
  box-shadow: 2px 2px 10px black;
  z-index: 10;
}
</style>