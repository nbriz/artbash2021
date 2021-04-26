window.createLoader = function (callbak, hideInfo) {
  const loader = document.createElement('loader')
  loader.className = 'loader'
  const btn = document.createElement('div')
  btn.className = 'btn'
  loader.appendChild(btn)
  btn.textContent = '0%'
  loader.update = function (val) {
    if (val < 1) {
      btn.textContent = Math.round(100 * val) + '%'
    } else {
      btn.textContent = 'ENTER'
      btn.className = 'btn clickable'
      btn.addEventListener('click', callbak)
    }
  }
  document.body.appendChild(loader)
  if (hideInfo) return loader
  const nfo = document.createElement('div')
  nfo.className = 'instructions'
  nfo.innerHTML = `
    click a piece (or artist in the menu) to view info
    <br>
    click <img src="../images/eye-black.svg"> for work detail
    <br>
    click <img src="../images/profile-black.svg"> for artist profile
  `
  loader.appendChild(nfo)
  return loader
}
