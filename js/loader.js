/* global Averigua */
window.createLoader = function (callbak, hideInfo) {
  const loader = document.createElement('loader')
  loader.className = 'loader'
  if (Averigua.browserInfo().name === 'Safari') {
    const wrn = document.createElement('div')
    wrn.className = 'instructions'
    wrn.innerHTML = 'It appears you\'re using Safari, this browser does not have great support for WebGL and may not properly render all the elements in the gallery. Try using a modern browser like <a href="https://brave.com/" target="_blank">Brave</a>, <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">Firefox</a> or <a href="https://www.google.com/chrome/" target="_blank">Chrome</a>.'
    loader.appendChild(wrn)
  }
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
