Component({
  properties: {
    index: Number,
    sno: String,
    custClass: String,
  },
  methods: {
    onClose(e) {
        debugger
      this.triggerEvent("close", e);
    },
  },
});
