Component({
  properties: {
    index: Number,
    sno: String,
    custClass: String,
  },
  methods: {
    onClose(e) {
      this.triggerEvent("close", e);
    },
  },
});
