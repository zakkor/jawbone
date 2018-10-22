import Jawbone from '../src/Jawbone'

class CatView extends Jawbone.View {
  static template = m => {
    return `
      <p>Hi, I'm a cat and my name is: ${m.name} </p>`
  }
}

class HelloView extends Jawbone.View {
  static el = '#root'
  static template = (m) => {
    return `
      <input type="text" value="${m.name}">
      <p>Hello, ${m.name} </p>
      <p>A list, ${m.list} </p>`
  }
}

let hello = { name: 'World', list: [1, 2, 3] }
let helloView = new HelloView(hello)
// note that you have to reassign hello to use it as a model
hello = helloView.model
hello.list.push(1)