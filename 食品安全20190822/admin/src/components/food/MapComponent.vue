<template>
  <div id="container">
    <el-button
          size="medium"
          type="danger"
          style="position:fixed;bottom:10px;right:10px;font-size:15px;z-index:100;"
          @click="goPrevious()"
        >退出</el-button>
  </div>
</template>
<script>
import { TMap } from "./map";
export default {
  data: function() {
    return {
      carMarkerInfo: {},
      signStatus: 0,
      positions: [],
      autoPath: [],
      pathIndex: -1,
      carMarker: {},
      spherical: {},
      timer: {},
      carPosition: {},
      map: {},
      signInfo: {}
    };
  },
  watch: {
    positions() {
      this.createMap();
    },
    autoPath() {
      this.timer = setInterval(this.moveCar, 1000);
    },
    carPosition(newValue, oldValue) {
      console.log(1);
      if (
        newValue &&
        (Math.abs(
          newValue.getLat() -
            this.positions[this.positions.length - 1].logisticsEndweiduGeo
        ) < 0.1 &&
          Math.abs(
            newValue.getLng() -
              this.positions[this.positions.length - 1].logisticsEndjingduGeo
          ) < 0.1)
      ) {
        this.signInfo.open();
      }
    }
  },
  created: function() {
    this.init();
  },
  methods: {
    createMap() {
      TMap("HMBBZ-HI4C4-O7PU7-DDM2K-XKI2S-PTFIN").then(qq => {
        var self = this;
        self.map = new qq.maps.Map(document.getElementById("container"));
        this.spherical = qq.maps.geometry.spherical;
        var path = [];
        self.signInfo = new qq.maps.InfoWindow({
          map: self.map
        });
        for (var i = 0; i < this.positions.length; i++) {
          var item = this.positions[i];
          self.carPosition = new qq.maps.LatLng(
            item.logisiticsCarweiduGeo,
            item.logisiticsCarjingduGeo
          );
          path.push(
            new qq.maps.LatLng(
              item.logisticsStartWeiduGeo,
              item.logisticsStartjingduGeo
            )
          );
          if (i == this.positions.length - 1)
            path.push(
              new qq.maps.LatLng(
                item.logisticsEndweiduGeo,
                item.logisticsEndjingduGeo
              )
            );
          if (item.logisiticsSignStatus == 0) {
            self.signInfo.setContent(
              '<button style="text-align:left;margin:10px" id="sign">签收</button>'
            );
            self.signInfo.setPosition(
              new qq.maps.LatLng(
                item.logisticsEndweiduGeo,
                item.logisticsEndjingduGeo
              )
            );
          }
        }
        
        for (var index = 0; index < path.length; index++) {
          var mapLabel = new qq.maps.Label({
            map: self.map,
            offset: new qq.maps.Size(10, -50),
            position: path[index]
          });
          var marker = new qq.maps.Marker({
            map: self.map,
            position: path[index],
            animation: qq.maps.MarkerAnimation.DOWN
          });
          this.getAddressOfMap(mapLabel, path[index]);
          if (index != path.length - 1) {
            var polylineParams = {
              map: self.map,
              strokeDashStyle: "solid",
              strokeColor: new qq.maps.Color(255, 193, 37, 0.5),
              strokeWeight: 6
            };
            if (index < path.length - 2)
              this.drivingPath(path[index], path[index + 1], polylineParams);
            else if (index == path.length - 2) {
              this.drivingPath(path[index], self.carPosition, polylineParams);
              this.drivingPath(self.carPosition, path[index + 1], {
                map: self.map,
                strokeDashStyle: "dash",
                strokeColor: "#FFC125",
                strokeWeight: 6
              });
            }
          }
        }
        var anchor = new qq.maps.Point(0, 5),
          size = new qq.maps.Size(30, 20),
          origin = new qq.maps.Point(0, 0);
        var info = new qq.maps.InfoWindow({
          map: self.map
        });

        var rotation = this.computeRotaion(
          qq.maps.geometry.spherical.computeHeading(
            self.carPosition,
            path[path.length - 1]
          )
        );
        this.carMarker = new qq.maps.Marker({
          map: self.map,
          position: self.carPosition,
          animation: qq.maps.MarkerAnimation.DOWN,
          rotation: rotation,
          title: "我是物流小车",
          icon: new qq.maps.MarkerImage(
            "http://webapi.amap.com/images/car.png",
            size,
            origin,
            anchor,
            size
          )
        });

        console.log(this.carMarker);
        this.carMarkerInfo = new qq.maps.InfoWindow({
          map: self.map
        });
        self.carMarkerInfo.setContent(
          `<div style="text-align:left;white-space:nowrap; +
                'margin:10px;">上一站地址：${self.positions[self.positions.length - 1].logisticsStartAddress}</div>
                <div style="text-align:left;white-space:nowrap; +
                'margin:10px;">下一站地址：${self.positions[self.positions.length - 1].logisticsEndAddress}</div>
                <div style="text-align:left;white-space:nowrap; +
                'margin:10px;">上站签收人：${self.positions[self.positions.length - 1].logisticsStartPerson}</div>`
        );
        //标记Marker点击事件
        qq.maps.event.addListener(this.carMarker, "click", function() {
          self.carMarkerInfo.open();
          self.carMarkerInfo.setPosition(self.carMarker.getPosition());
        });
        qq.maps.event.addListener(self.signInfo, "domready", function() {
          window.document.getElementById("sign") &&
            window.document
              .getElementById("sign")
              .addEventListener("click", self.goSign, false);
        });
      });
    },
    getAddressOfMap(mapLabel, location) {
      new qq.maps.Geocoder({
        complete: function(result) {
          mapLabel.setContent(result.detail.address);
        }
      }).getAddress(location);
    },
    drivingPath(start, end, polylineParams) {
      var self = this;
      var driving = new qq.maps.DrivingService({
        complete: function(response) {
          var startPro = response.detail.start;
          polylineParams.path = response.detail.routes[0].path;
          if (start == self.carPosition) self.autoPath = polylineParams.path;

          new qq.maps.Polyline(polylineParams);
        }
      });
      driving.search(start, end);
    },
    init() {
      this.$axios
        .get("http://10.96.116.248:80/api/queryrouter", {
          params: {
            logisticsBatchBarcode:
              window.sessionStorage.getItem("barCode") || ""
          }
        })
        .then(response => {
          console.log(JSON.stringify(response));
          let result = response.data;
          if (result.status == 200) {
            this.positions = result.data;
          }
        });
    },
    computeRotaion(heading) {
      let rotation;
      if (heading < 0) {
        rotation = 270 + heading;
      } else {
        rotation = heading - 90;
      }
      return rotation;
    },
    moveCar() {
      this.pathIndex += 20;
      if (this.autoPath.length > 0 && this.pathIndex < this.autoPath.length) {
        this.carPosition = this.autoPath[this.pathIndex];
        this.carMarker.setPosition(this.carPosition);
        var rotation = this.computeRotaion(
          this.spherical.computeHeading(
            this.autoPath[this.pathIndex],
            this.autoPath[this.pathIndex + 10]
          )
        );
        this.carMarker.setRotation(rotation);
        this.carMarkerInfo.setPosition(this.autoPath[this.pathIndex]);
      } else {
        console.log(1);
        clearInterval(this.timer);
      }
    },
    goSign() {
      var self = this;
      console.log(this.positions[self.positions.length - 1]);
      window.sessionStorage.setItem(
        "logistics",
        JSON.stringify(this.positions[self.positions.length - 1])
      );
      this.$router.push({
        name: "sign"
      });
    },
    goPrevious()
    {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
#container {
  min-width: 600px;
  min-height: 620px;
  box-shadow: 2px 2px 10px black;
}
</style>
