//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo:false
  },
  
  doAuthorization(e) {
    var that = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo',res.userInfo)
      }
    })
 
  },

  addMarker(e){
    wx.navigateTo({
      url: '', //后续增加
    })
  },
 
  // 事件处理函数
  bindViewTap: function() {
   
  },
  onShow: function() {
   
  }
})
