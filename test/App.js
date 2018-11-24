import Jawbone from '../src/Jawbone'

// class CatView extends Jawbone.View {
//   static template = m => {
//     return `
//       <p>Hi, I'm a cat and my name is: ${m.name} </p>`
//   }
// }

// class HelloView extends Jawbone.View {
//   static el = '#root'
//   static template = (m) => {
//     return `
//       <input type="text" value="${m.name}">
//       <p>Hello, ${m.name} </p>
//       <p>A list, ${m.list} </p>`
//   }
// }

// let hello = { name: 'World', list: [1, 2, 3] }
// let helloView = new HelloView(hello)
// // note that you have to reassign hello to use it as a model
// hello = helloView.model
// hello.list.push(1)

// class Foo {
//   attrs = {}
//   events = {}
//   something() {
//     console.log('this.attrs:', this.attrs)
//     console.log('this.lol:', this.lol)
    
    

//   }
//   constructor(attrs) {
//     // let child = new Object.create(Object.getPrototypeOf(this.constructor))
//     // console.log('child:', child)
//     this.attrs = null    
//     Object.defineProperty(this, 'lol', { value: 'kek'})
//   }
// }

// class Bar extends Foo {
//   attrs = {
//     x: 12,
//     lol: this.something,
//   }
//   defaultProp = 15

// }


// let bar = new Bar()
// bar.something()

let mod = Jawbone.Model.extend({
  props: {
    name: 'John',
    names: ['Jenny', 'Johnny']
  }
})
window.mod = mod

// class Model {
//   static spec = undefined
//   __attrs = null


//   constructor(attrs) {
//     if (attrs) {
//       this.spec = attrs
//     } else {
//       this.spec = this.constructor.attrs
//     }
//     this.init()
//   }

//   init() {
//     this.__attrs = {}

//     for (let [key, val] of Object.entries(this.spec)) {
//       if (val.constructor.name === 'Array') {
//         let proxy = new Proxy(val, {
//           get: (target, name) => {
//             return target[name]
//           },
//           set: (target, name, value) => {
//             target[name] = value

//             // trigger change event
//             if (this.onChange !== undefined) {
//               this.onChange()
//             }

//             return true
//           }
//         })
//         val = proxy

//         // Object.defineProperty(this, key, {
//         //   set: val => {
//         //     this.__attrs[key] = val
  
//         //     // trigger change event
//         //     if (this.onChange !== undefined) {
//         //       this.onChange()
//         //     }
//         //   },
//         //   get: () => {
//         //     return this.__attrs[key]
//         //   }
//         // })
//         // this[key] = proxy
//       }

//       Object.defineProperty(this, key, {
//         set: val => {
//           this.__attrs[key] = val

//           // trigger change event
//           if (this.onChange !== undefined) {
//             this.onChange()
//           }
//         },
//         get: () => {
//           return this.__attrs[key]
//         }
//       })
//       this[key] = val
//     }
//   }
// }

// class Dog extends Model {
//   static attrs = {
//     name: 'John',
//     names: ['The', 'Dog']
//   }
// }

// let dog = new Dog();
// window.dog = dog