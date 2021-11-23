// pages/home/home.js
const utils = require("../../utils/util.js")
const markersList = require("../../common/datas/marks.js")
const infos = require("../../common/datas/park_introduce.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Height:0,
    latitude:0,
    longitude:0,
    scale:15,
    url:'../home/home',
    introduce_text:'',
    markers:[],
    parks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var _this = this
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({   
            Height: res.windowHeight,
            infos:infos.info
        })
      }
    })
  //  this.locationAuth();
   this.addMarkers();
   var a = wx.getStorageSync('userInfo')
   console.log(a)
  },

  //展示地图
  showMaps:function(){
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true, //高精度定位  定位成功，更新定位结果
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      },
      // 定位失败回调
      fail: function () {
        wx.showToast({
          title: "定位失败",
        })
      },
      complete: function () {
        //隐藏加载框
        // wx.hideLoading()

      }
    })
  },
  //撒点
  addMarkers:function(){
    // console.log(utils.allMarkers)
    var markers = markersList.allMarkers;
    this.setData({
      markers
    })
    // this.nearParks()
  },

  getUrl(e){
    console.log("urltap")
    var that = this
    var lat = this.data.latitude
    var lng = this.data.longitude
    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo==undefined || userInfo==''){
      // that.setData({
      //   url:'../search/search?latitude='+lat+'&longitude='+lng,
      // })
      utils.check()
    }
    else{
      that.setData({
        url:'../search/search?latitude='+lat+'&longitude='+lng,
      })
    }
  },
  //获取最近驿站
  nearParks:function(e){
    var pages = getCurrentPages()
    console.log(pages)
    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo==undefined || userInfo==''){
      utils.check()
    }else{
    let m = this.data.markers
    var that = this
    var park = []
    var tos=[]
    //整理目标驿站坐标
    for(let i=0;i<m.length;i++){
      let location = {
        latitude:m[i].latitude,
        longitude:m[i].longitude
      }
      tos.push(location)
    }
    utils.qqmapsdk.calculateDistance({
        mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
        from: {
          latitude:this.data.latitude,
          longitude:this.data.longitude
        }, //若起点有数据则采用起点坐标，若为空默认当前地址
        to :tos, //终点坐标
        success: function(res) {
          console.log(res);
          var res = res.result.elements;
          console.log(tos)
          for(let i=0;i<m.length;i++){
            if(m[i].latitude==res[i].to.lat && m[i].longitude==res[i].to.lng){
              let p ={
                latitude: m[i].latitude,
                longitude: m[i].longitude,
                name : m[i].name,
                addr:m[i].addr,
                distance:res[i].distance
              }
              park.push(p)
            }
          }
        },
        fail: function(error) {
          console.error(error);
        },
        complete:function(e){
          let p=[]
          //升序
          park.sort(function(a,b){
              return (a.distance-b.distance)
          })
          for(let i=0;i<park.length&&i<3;i++){
            p.push(park[i])
          }
          that.setData({
            parks:p
          })
          console.log(that.data.parks)
        }
    })
  }
  },

   //底部弹框
   popup(e) {
    var markers =this.data.markers;
    var marker = []
    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo==undefined || userInfo==''){
      utils.check()
    }else{
    //获取指定 marker 的属性
    for(let m =0; m<markers.length;m++){
      if(markers[m].id==e.detail.markerId){
        marker = markers[m]
      }
    }
    this.setData({
      marker,
      show: true,
    })
  }
  },

   //重回当前位置
   back2location(e){
     var that = this
    console.log('tap')
    let mpCtx = wx.createMapContext('map')
    mpCtx.moveToLocation({
      success:function(e){
        that.setData({
          scale:15
        })
      }
    })
  },

  //导航
  move2Location(e){
    // console.log(e)
    var park = e.currentTarget.dataset.park
    console.log(park)
    wx:wx.openLocation({
      latitude: park.latitude,
      longitude: park.longitude,
      address: park.addr,
      name: park.name,
      scale: 15,
    })
    
  },

  //跳转到搜索页面
  move2SearchPage(e){
    var userInfo = wx.getStorageSync('userInfo')
    if(userInfo==undefined || userInfo==''){
      utils.check()
    }else{
    console.log("search tap")
    var lat = this.data.latitude
    var lng = this.data.longitude
    console.log(lat,lng)
   wx.navigateTo({
      url: '../search/search?latitude='+lat+'&longitude='+lng,
    })
  }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    var lat = this.data.latitude
    var lng = this.data.longitude
    wx.getSetting({
      success(res){
        if(!res.authSetting['scope.userLocation']){
          //需要授权
          wx.authorize({
            scope: 'scope.userLocation',
            success(){
              that.showMaps()
            }
          })
        }else{
          that.showMaps()
        }
      }
    })
    if(userInfo!=undefined && userInfo!=''){
      that.setData({
        url:'../search/search?latitude='+lat+'&longitude='+lng,
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})