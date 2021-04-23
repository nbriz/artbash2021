window.createLoader = function (callbak) {
  const loader = document.createElement('loader')
  loader.className = 'loader'
  const btn = document.createElement('div')
  loader.appendChild(btn)
  btn.textContent = '0%'
  loader.update = function (val) {
    if (val < 1) {
      btn.textContent = Math.round(100 * val) + '%'
    } else {
      btn.textContent = 'ENTER'
      btn.className = 'clickable'
      btn.addEventListener('click', callbak)
    }
  }
  document.body.appendChild(loader)
  return loader
}
