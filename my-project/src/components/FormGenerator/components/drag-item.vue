<script>
import draggable from 'vuedraggable'
import render from '../render/render'

const components = {
  itemBtns(h, currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners
    return [
      <span
        class="drawing-item-copy"
        title="复制"
        onClick={event => {
          copyItem(currentItem, list)
          event.stopPropagation()
        }}
      >
        <a-icon type="copy" />
      </span>,
      <span
        class="drawing-item-delete"
        title="删除"
        onClick={event => {
          deleteItem(index, list)
          event.stopPropagation()
        }}
      >
        <a-icon type="delete" />
      </span>
    ]
  }
}

const layouts = {
  colFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    return (
      <a-col
        span={config.span}
        class={className}
        nativeOnClick={event => {
          activeItem(currentItem)
          event.stopPropagation()
        }}
      >
        <a-form-model-item label={config.showLabel ? config.label : ''} required={config.required}>
          <render
            key={config.renderKey}
            conf={currentItem}
            onInput={event => {
              this.$set(config, 'defaultValue', event)
            }}
          >
            {child}
          </render>
        </a-form-model-item>
        {components.itemBtns.apply(this, arguments)}
      </a-col>
    )
  },

  tableLayout(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    return (
      <a-col
        span={config.span}
        class={className}
        nativeOnClick={event => {
          activeItem(currentItem)
          event.stopPropagation()
        }}
      >
        <a-form-model-item label={config.showLabel ? config.label : ''} required={config.required}>
          <render
            key={config.renderKey}
            conf={currentItem}
            onSelect={event => {
              this.$set(currentItem, 'selectedCol', event)
            }}
          >
            {child}
          </render>
        </a-form-model-item>
        {components.itemBtns.apply(this, arguments)}
      </a-col>
    )
  }
}

function renderChildren(h, currentItem, index, list) {
  const config = currentItem.__config__
  if (!Array.isArray(config.children)) return null
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout]
    if (layout) {
      return layout.call(this, h, el, i, config.children)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`)
}

export default {
  components: {
    render,
    draggable
  },
  props: ['currentItem', 'index', 'drawingList', 'activeId', 'formConf'],
  render(h) {
    const layout = layouts[this.currentItem.__config__.layout]
    if (layout) {
      return layout.call(this, h, this.currentItem, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>
