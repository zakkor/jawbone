import Jawbone from '../src/Jawbone'

class Cat extends Jawbone.Model {
  static attrs = {
    color: 'red',
  }

  getOppositeColor(color) {
    if (color == 'red') {
      return 'blue'
    }
    return 'red'
  }

  toggleColor() {
    this.color = this.getOppositeColor(this.color)
  }
}

const catTemplate = (m) => {
  return `
    <div class="box ${m.color}"> </div>

    <button onclick="${m.toggleColor}"> Change color to ${m.getOppositeColor(m.color)} </button>
    <br><br>
    <br><br>

    <label> Try changing the color to 'green' or 'black', by typing: </label>
    <br><br>
    <input type="text" value="${m.color}">
  `
}

class CatView extends Jawbone.View {
  static template = catTemplate
}

let cat = new Cat()
const catView = new CatView(cat)

window.cat = cat 