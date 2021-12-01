const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//引入腾讯地图服务
      // 引入SDK核心类
var QQMapWX = require('./qqmap-wx-jssdk.min.js');
      // 实例化API核心类
const qqmapsdk = new QQMapWX({
          key: '' // 必填
      });

function goto_login(){
    wx.showModal({
      title: '提示',
      content: '请先登录',
      showCancel:false,
      success(res){
        if(res.confirm){
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    })
   
  }

//测试坐标
const customCallout1 = {
  id: 1,
  latitude: 23.073437,
  longitude: 112.516037 ,
  iconPath: '../../images/marks.png',
  width:24,
  height:32,
  name:'中国石化肇庆城区蓝塘加油站工会户外劳动者爱心驿站',
  addr:'广东省肇庆市端州区端州一路26号'
}
const customCallout2 = {
  id: 2,
  latitude:  23.02619,
  longitude: 112.45855,
  iconPath: '../../images/marks.png',
  width:24,
  height:32,
  name:'工商银行肇庆高要支行户外劳动者工会爱心驿站',
  addr:'广东省肇庆市高要区南岸镇府前大街112号'
}
const customCallout3 = {
  id: 3,
  latitude:  23.073635,
  longitude: 112.473015,
  iconPath: '../../images/marks.png',
  width:24,
  height:32,
  name:'星湖牌坊广场户外劳动者服务站',
  addr:'广东省肇庆市端州区七星路1号七星岩景区内'
}
const customCallout4 = {
  id: 4,
  latitude: 23.058277,
  longitude:  112.451548,
  iconPath: '../../images/marks.png',
  width:24,
  height:32,
  name:'电信黄塘营业厅户外劳动者服务站',
  addr:'广东省肇庆市端州区电信黄塘营业厅'
}

const allMarkers = [customCallout1,customCallout2,customCallout3,customCallout4]


module.exports = {
  allMarkers:allMarkers,
  qqmapsdk:qqmapsdk,
  check:goto_login,
  formatTime
}
