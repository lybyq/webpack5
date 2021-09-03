import './style/index.scss'

const fn = async () => {
  const element = document.createElement('div')
  const { default: _ } = await import('lodash')
  element.innerHTML = _.join(['Hello', 'webpack5'], ' ')
  return element
}

fn().then((comp) => {
  document.body.appendChild(comp)
})

const a = {
  name: 'kobe',
  age: 29,
  work: 'bascatball'
}

console.log(a)