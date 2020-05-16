Component({
  properties: {
    isShow:{
      type:Boolean,
      value:false
    },
    label: {
      // 属性名
      type: String,
      value: "账号:",
    },
    isRightIcon: {
      type: Boolean,
      value: false,
    },
    titleWidth: {
      type: String,
      value: "100rpx",
    },
    required: {
      type: Boolean,
      value: true,
    },
    clearable: {
      type: Boolean,
      value: true,
    },
    placeholder: {
      type: String,
      value: "",
    },
    readonly: {
      type: Boolean,
      value: false,
    },
    value: {
      type: String,
      value: "",
    },
    type: String, // 简化的定义方式
  },
  data: { autoSize: { maxHeight: 200, minHeight: 50 } },
  methods: {
    showTips(e) {
      this.triggerEvent("onFocus", e.detail);
    },
    hideTips(e) {
      this.triggerEvent("onBlur", e.detail);
    },
    inputKey(e) {
      this.triggerEvent("onInput", e.detail);
    }
    
  },
});
