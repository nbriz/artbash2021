window.createDisclaimer = function () {
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
