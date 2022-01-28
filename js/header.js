window.createHeader = function (wtxt, homepage) {
  const header = document.createElement('header')
  header.style.display = 'none'
  header.style.transition = 'opacity 3s'
  const leftCorner = (homepage)
    ? '<img src="../images/saic-left.png">'
    : '2021<br> &gt; ART<br>BASH<br>'
  header.innerHTML = `
    <span id="ab2021">
      ${leftCorner}
    </span>
    <!-- <img src="../images/menu.svg" alt="menu"> -->
    <span class="title">???</span>
    <img src="../images/sound-on.svg" alt="menu" id="sound-icon">`

  const ab = header.querySelector('#ab2021')
  ab.style.fontFamily = 'uni0553'
  ab.style.fontSize = '2vw'
  ab.style.margin = '2.5vw 0vw 0vw 2vw'
  ab.style.lineHeight = '1.6vw'
  ab.style.cursor = 'url(../images/pointer--white.svg) 5 0, auto'
  ab.addEventListener('click', () => {
    if (homepage) window.location = 'https://www.saic.edu/academics/departments/contemporary-practices'
    else window.location = '/'
  })

  const si = header.querySelector('#sound-icon')
  si.style.marginTop = '5vw'
  si.style.cursor = 'url(../images/pointer--white.svg) 5 0, auto'

  const m = header.querySelector('[alt="menu"]')
  const css = document.querySelector(':root')
  m.addEventListener('mouseover', () => {
    css.style.setProperty('--pointerX3', 'url(../images/pointer--white.svg) 5 0, auto')
  })
  m.addEventListener('mouseout', () => {
    css.style.setProperty('--pointerX3', 'url(../images/pointerX3.svg) 35 5, auto')
  })
  m.addEventListener('click', () => {
    if (wtxt) wtxt.displayShowInfo()
  })
  document.body.appendChild(header)
  return header
}
