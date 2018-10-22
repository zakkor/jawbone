import Jawbone from "./Jawbone";

export default class View {
  static model = undefined
  static template = undefined

  constructor(model, parent) {
    if (model) {
      // received POJO, construct default model
      if (model.constructor.name === 'Object') {
        this.model = new Jawbone.Model(model) 
      } else {
        this.model = model
      }
    } else {
      this.model = new this.constructor.model()
    }
    this.template = this.constructor.template
    this.parent = parent
    console.log('parent', parent)

    if (this.constructor.el) {
      this.el = document.querySelector(this.constructor.el)
    } else {
      const encodeAttrs = (attrs) => {
        return JSON.stringify(attrs).replace(/"/g, '&quot;')
      }

      if (!this.parent.children) {
        this.parent.children = {}
      }
      this.parent.children[this.constructor.name] = this.constructor
      console.log(this.model.__attrs)
      
      this.toString = () => {
        return `<#jawbone-binding#><#key:jawbone-view-${this.constructor.name}#><#val:${encodeAttrs(this.model.__attrs)}#>`
      }
    }

    this.model.onChange = () => {
      this.render()
    }
    this.render()
  }

  _unpackBinding(binding) {
    const identLabel = '<#jawbone-binding#>'
    if (binding.indexOf(identLabel) != -1) {
      binding = binding.replace(identLabel, '')
    } else {
      return null
    }

    
    const keyLabel = '<#key:'
    const keyStartIdx = binding.indexOf(keyLabel)
    if (keyStartIdx != -1) {
      binding = binding.replace(keyLabel, '')
    }
    const keyEndIdx = binding.indexOf('#>')
    const key = binding.slice(keyStartIdx, keyEndIdx)
    binding = binding.slice(keyEndIdx + 2)

    const valLabel = '<#val:'
    if (binding.indexOf(valLabel) != -1) {
      binding = binding.replace(valLabel, '')
    }
    const valEndIdx = binding.indexOf('#>')
    const val = binding.slice(0, valEndIdx)
    binding = binding.slice(valEndIdx + 2)

    return {
      key,
      val  
    }
  }

  _substituteBinding(text) {
    text = text.replace(/<#jawbone-binding#>/g, '', -1)
    text = text.replace(/<#key:.*?#>/g, '', -1)
    text = text.replace(/<#val:/g, '', -1)
    text = text.replace(/#>/g, '', -1)
    return text
  }

  _attachEventListeners(renderedBindings) {
    let els = htmlToElements(renderedBindings)

    for (let el of els) {
      switch (el.nodeName) {
      case 'BUTTON':
      case 'DIV':
      case 'P':
      case 'LABEL':
        let attrsToRemove = []
        for (let attr of el.attributes) {
          const unpacked = this._unpackBinding(attr.nodeValue)

          // event handlers
          if (typeof(this.model[unpacked.key]) === 'function') {
            const eventName = attr.nodeName.slice(2) // remove 'on' from start
            el.addEventListener(eventName, event => {
              this.model[unpacked.key]()
            })
            attrsToRemove.push(attr.nodeName)
          }
          // value substitution
          else {
            const substituted = this._substituteBinding(attr.nodeValue)
            attr.nodeValue = substituted
          }

        }

        for (let toRemove of attrsToRemove) {
          el.removeAttribute(toRemove)
        }

        const unpacked = this._unpackBinding(el.innerText)
        if (unpacked.key.startsWith('jawbone-view-')) {
          const viewName = unpacked.key.slice('jawbone-view-'.length)
          console.log(viewName)
          console.log('unpacked.val', unpacked.val)
          let viewAttrs = JSON.parse(unpacked.val)
          let viewCtor = this.children[viewName]

          let view = new viewCtor(viewAttrs, this)
          let els = view.render()

          el.innerHTML = ''

          for (let i = els.length-1; i >= 0; i--) {
            el.prepend(els[i])
          }
          console.log('view')
        }

        const substituted = this._substituteBinding(el.innerText)
        el.innerText = substituted
        break
      }

      if (el.nodeName === 'INPUT') {
        const substituted = this._substituteBinding(el.attributes['value'].nodeValue)
        const unpacked = this._unpackBinding(el.attributes['value'].nodeValue)
        if (unpacked) {
          el.attributes['value'].nodeValue = substituted

          el.addEventListener('change', event => {
            this.model[unpacked.key] = event.target.value
          })
        }
      }
    }

    return els
  }

  _generateBindings(model) {
    let bindings = {}

    // add attrs
    for (let [key, val] of Object.entries(model.__attrs)) {
      let binding = new String(val)
      binding.toString = () => `<#jawbone-binding#><#key:${key}#><#val:${val}#>`

      bindings[key] = binding
    }

    // add functions from prototype
    const proto = Object.getPrototypeOf(model)
    for (let key of Object.getOwnPropertyNames(proto)) {
      // ignore ctor
      if (key === 'constructor') {
        continue
      }

      const descriptor = Object.getOwnPropertyDescriptor(proto, key)

      bindings[key] = descriptor.value
      bindings[key].toString = () => `<#jawbone-binding#><#key:${key}#><#val:${key}#>`
    }
    return bindings
  }

  render() {
    const bindings = this._generateBindings(this.model)
    const renderedBindings = this.template(bindings, this)

    const els = this._attachEventListeners(renderedBindings)

    if (this.el) {
      this.el.innerHTML = ''

      for (let i = els.length-1; i >= 0; i--) {
        this.el.prepend(els[i])
      }
    } else {
      return els
    }
  }
}

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}