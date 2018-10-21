export default class View {
  static model = undefined
  static template = undefined

  constructor(model) {
    if (model) {
      this.model = model
    } else {
      this.model = new this.constructor.model()
    }
    this.template = this.constructor.template

    this.model.onChange = () => {
      this.render()
    }
    this.render()
  }

  attachEventListeners(renderedBindings) {
    const unpackBinding = binding => {
      const identLabel = '<#trombone-binding#>'
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
    const substBinding = text => {
      text = text.replace(/<#trombone-binding#>/g, '', -1)
      text = text.replace(/<#key:.*?#>/g, '', -1)
      text = text.replace(/<#val:/g, '', -1)
      text = text.replace(/#>/g, '', -1)
      return text
    }

    let els = htmlToElements(renderedBindings)

    for (let el of els) {
      if (el.nodeName === 'BUTTON' || el.nodeName === 'DIV') {

        let attrsToRemove = []
        for (let attr of el.attributes) {
          const unpacked = unpackBinding(attr.nodeValue)

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
            const substituted = substBinding(attr.nodeValue)
            attr.nodeValue = substituted
          }

        }

        for (let toRemove of attrsToRemove) {
          el.removeAttribute(toRemove)
        }

        const substituted = substBinding(el.innerText)
        el.innerText = substituted
      }
      // if (el.nodeName === 'LABEL') {
      //   const substituted = substBinding(el.innerText)
      //   el.innerText = substituted
      // }
      // if (el.nodeName === 'P') {
      //   const substituted = substBinding(el.innerText)
      //   const unpacked = unpackBinding(el.innerText)
      //   if (unpacked) {
      //     el.innerText = substituted
      //   }
      // }
      if (el.nodeName === 'INPUT') {
        const substituted = substBinding(el.attributes['value'].nodeValue)
        const unpacked = unpackBinding(el.attributes['value'].nodeValue)
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

  generateBindings(model) {
    let bindings = {}

    // add attrs
    for (let [key, val] of Object.entries(model.__attrs)) {
      let binding = new String(val)
      binding.toString = () => `<#trombone-binding#><#key:${key}#><#val:${val}#>`

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
      bindings[key].toString = () => `<#trombone-binding#><#key:${key}#><#val:${key}#>`
    }
    return bindings
  }

  render() {
    let rootEl = document.querySelector('#root')

    const bindings = this.generateBindings(this.model)
    const renderedBindings = this.template(bindings)

    const els = this.attachEventListeners(renderedBindings)

    rootEl.innerHTML = ''

    for (let i = els.length-1; i >= 0; i--) {
      rootEl.prepend(els[i])
    }
  }
}

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}