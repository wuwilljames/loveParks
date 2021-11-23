// pages/search/search.js
const markerList = require("../../common/datas/marks.js")
const utils = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat:0,
    lng:0,
    inputValue:'',
    isfocus:false,
    parks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var lat = options.latitude
    var lng = options.longitude
    this.setData({
      lat:lat,
      lng:lng
    })
    console.log(this.data.isfocus,lat,lng)
  },

  //获得焦点
  focustap(e){
    console.log("focustap")
    this.setData({
      isfocus:true,
      mkrs:[]
    })
    this.getClosePark()
   
  },

  //失去焦点
  outfocustap(e){
    console.log("outfocustap")
    this.setData({
      isfocus:false
    })
  },

getClosePark(e){
  var m = markerList.allMarkers
  var that = this
  var park = []
  var tos=[]
  for(let i=0;i<m.length;i++){
    let location = {
      latitude:m[i].latitude,
      longitude:m[i].longitude
    }
    tos.push(location)
  }
  console.log(tos)
  utils.qqmapsdk.calculateDistance({
      mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      from: {
        latitude:this.data.lat,
        longitude:this.data.lng
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
        for(let i=0;i<park.length&&i<4;i++){
          p.push(park[i])
        }
        that.setData({
          parks:p
        })
        console.log(that.data.parks)
      }
  })
  

},

  keyInput(e){
    console.log("inputtap")
    this.setData({
      inputValue: e.detail.value,
      isfocus:false //输入失去焦点
    })  
  },

  //搜索
  searchtap(e){
    var that = this
    var keyword = this.data.inputValue
    var lat = this.data.lat
    var lng = this.data.lng
    console.log(keyword,lat,lng)
    utils.qqmapsdk.search({
      keyword: keyword,  //搜索关键词
      location: {
        latitude:lat,
        longitude:lng
      },  //设置周边搜索中心点
      region:'广东省肇庆市',  //默认肇庆范围
      success: function (res) { 
        var mkrs = res.data
        that.setData({
          mkrs,
        })
        console.log(res)

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res){
        console.log(res);
      }
  });
  },

  move2Location(e){
    // console.log(e)
    var park = e.currentTarget.dataset.park
    var latitude=0
    var longitude=0
    var address=''
    var name=''
    console.log(park.ad_info)
    if(park.ad_info!=undefined){
      latitude=park.location.lat
      longitude=park.location.lng
      address =park.address
      name=park.title
    }else{
      latitude=park.latitude
      longitude=park.longitude
      address =park.addr
      name=park.name
    }

    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      address: address,
      name: name,
      scale: 15,
    })
    
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