// components/toast/toast.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    content:{
      type:String,
      value:"已扫码桶数与DN单桶数不一致"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ok(){
      this.setData({
        isShow: false
      })
      this.triggerEvent('ok')
    }
  }
})
