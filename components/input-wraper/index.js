Component({
  properties: {
    label: {
      // 属性名
      type: String,
      value: "账号:",
    },
    isRightIcon:{
      type:Boolean,
      value:false
    },
    titleWidth:{
      type:String,
      value:'100rpx'
    },
    required: {
      type: Boolean,
      value: true,
    },
    clearable: {
      type: Boolean,
      value: true,
    },
    placeholder:{
      type:String,
      value:''
    },
    readonly:{
      type:Boolean,
      value:false
    },
    value: {
      type: String,
      value: "",
    },
    errMsg:{
      type:String,
      value:''
    },
    type: String, // 简化的定义方式
  },
  methods: {
    changeValue(e) {
      this.triggerEvent("inputChange", e.detail);
    },
    onBlur(e){
      this.triggerEvent("onBlur", e.detail);
    }
  },
});
