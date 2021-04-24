/* global Averigua */
window.createDisclaimer = function () {
  if (Averigua.isMobile()) {
    const div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.width = '100vw'
    div.style.height = '100vh'
    div.style.zIndex = '9001'
    div.style.background = 'black none repeat scroll 0% 0%'
    div.style.color = 'rgb(255, 255, 255)'
    div.style.padding = '7vw'
    div.style.width = '100vw'
    div.style.fontSize = '6vw'
    div.style.lineHeight = '8.5vw'
    div.style.textAlign = 'center'
    div.style.display = 'flex'
    div.style.justifyContent = 'center'
    div.style.alignItems = 'center'
    const p = document.createElement('p')
    p.textContent = 'It looks like you’ve entered the site on a mobile browser… To fully experience the artwork, you must switch to a desktop before being allowed into the virutal galleries.'
    div.appendChild(p)
    document.body.appendChild(div)
    return div
  } else {
    const div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.zIndex = '9000'
    div.style.background = 'black none repeat scroll 0% 0%'
    div.style.color = 'rgb(255, 255, 255)'
    div.style.padding = '2vw'
    div.style.width = '100vw'
    div.style.fontSize = '1vw'
    div.style.lineHeight = '1.5vw'
    div.style.textAlign = 'center'
    div.innerHTML = 'This exhibition contains mature content which may not be appropriate for all ages.<br>The views expressed in this exhibition are the artists\' own and do not necessarily represent the views of The School of the Art Institute of Chicago.'
    document.body.appendChild(div)
    return div
  }
}
