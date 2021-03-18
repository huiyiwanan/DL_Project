export const tooltipMixin = {
  data() {
    return {
      tooltipContent: ''
    }
  },
  methods: {
    handleMouseOverTemp(e, str) {
      if (e.target.scrollWidth > e.target.offsetWidth) {
        const tooltip = this.$refs.tooltip
        this.tooltipContent = str
        tooltip.referenceElm = e.target
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
        tooltip.doDestroy()
        tooltip.setExpectedState(true)
        this.activateTooltip(tooltip)
      }
    },
    handleMouseOutTemp() {
      const tooltip = this.$refs.tooltip
      if (tooltip) {
        tooltip.setExpectedState(false)
        tooltip.handleClosePopper()
      }
    }
  },
  created() {
    this.activateTooltip = this.debounce(tooltip => tooltip.handleShowPopper(), 50)
  }
}