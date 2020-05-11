// components/nav/index.js
Component({

  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    backFlag:{
      type: Boolean,  
      value: false
    },
    title: {
      type: String,
    },
    custom:{
      type:Boolean,
      value:false
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
    goBack() {
      
      if (this.properties.custom){
        console.log("goPrev", this.properties.custom)
       this.triggerEvent('goPrev')
      
     }else{
        wx.navigateBack({
        })
     }
     
      
    }
  }
})
