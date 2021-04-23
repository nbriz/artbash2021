/* global THREE, TWEEN */
class Book {
  constructor () {
    this.textureLoader = new THREE.TextureLoader()
    this.basicMat = new THREE.MeshLambertMaterial({
      color: 0x08445c,
      side: THREE.DoubleSide
    })
    this.pagesMat = new THREE.MeshLambertMaterial({
      color: 0xffffff
    })
    this.invisiMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0
    })
  }

  openCover (time) {
    const t = time || 4000
    new TWEEN.Tween(this.cover.rotation)
      .to({ y: -Math.PI }, t)
      .easing(TWEEN.Easing.Quadratic.InOut)
      // .onComplete(callback)
      .start()
  }

  closeCover (time) {
    const t = time || 4000
    new TWEEN.Tween(this.cover.rotation)
      .to({ y: 0 }, t)
      .easing(TWEEN.Easing.Quadratic.InOut)
      // .onComplete(callback)
      .start()
  }

  highlightCover (r) {
    if (!r) this.pages.material.color.setHex(0xffffff)
    else this.pages.material.color.setHex(0xf9bfbd)
  }

  load (imagePath, callback) {
    const c = 0.02 // cover thickness
    const t = 0.05 + Math.random() * 0.05 // pages thickness
    const h = 0.5 + (Math.random() * 0.08 - 0.04) // cover height
    const w = 0.4 + (Math.random() * 0.05 - 0.025) // cover width
    const o = 0.02 // pages offset
    this.thickness = t + c * 2 // total thickness

    this.textureLoader.load(imagePath, (txt) => {
      const book = new THREE.Mesh(
        new THREE.BoxBufferGeometry(w, h, this.thickness),
        this.invisiMat
      )
      book.castShadow = true

      // spine
      let geometry = new THREE.BoxBufferGeometry(o, h, this.thickness)
      const spine = new THREE.Mesh(geometry, this.basicMat)
      spine.position.x = -(w / 2)
      book.add(spine)

      // back cover
      geometry = new THREE.BoxBufferGeometry(w, h, c)
      const back = new THREE.Mesh(geometry, this.basicMat)
      back.position.z = -(t / 2 + c / 2)
      book.add(back)

      // pages
      geometry = new THREE.BoxBufferGeometry(w - o, h - o, t)
      this.pages = new THREE.Mesh(geometry, this.pagesMat)
      book.add(this.pages)

      // front cover
      geometry = new THREE.BoxBufferGeometry(w, h, c)
      const front = new THREE.Mesh(geometry, this.basicMat)
      front.position.x = w * 0.5
      this.cover = new THREE.Mesh(
        new THREE.BoxBufferGeometry(w * 2, h, c),
        // new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        this.invisiMat
      )
      this.cover.add(front)
      this.cover.position.z = t / 2 + c / 2
      this.cover.position.x = -w * 0.5
      book.add(this.cover)

      this.mesh = book

      if (callback) callback(book, this.thickness)
    })
  }
}
if (typeof module !== 'undefined') module.exports = Book
