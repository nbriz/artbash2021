/* global THREE, TWEEN, innerWidth, innerHeight */
class PictureFrame {
  constructor () {
    this.textureLoader = new THREE.TextureLoader()
    this.basicMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    })
    this.glassMat = new THREE.MeshPhysicalMaterial({
      map: null,
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.33,
      opacity: 0.1,
      transparent: true,
      premultipliedAlpha: true
    })
    this.invisiMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0
    })
  }

  load (imagePath, callback) {
    const d = 0.04 // depth of frame
    const b = 0.04 // thickness of frame border
    const m = 0.07 // matte interior
    this.textureLoader.load(imagePath, (txt) => {
      const ar = txt.image.width / txt.image.height
      const w = 1 * ar
      const h = 1
      const frame = new THREE.Mesh(
        new THREE.BoxBufferGeometry(w, h, d),
        this.invisiMat
      )

      // backing
      let geometry = new THREE.PlaneBufferGeometry(w, h, 1)
      const back = new THREE.Mesh(geometry, this.basicMat)
      back.position.z = -d / 2
      frame.add(back)

      // frame
      geometry = new THREE.BoxBufferGeometry(b, h, d)
      const left = new THREE.Mesh(geometry, this.basicMat)
      left.position.x = (-w / 2) + (b / 2)
      frame.add(left)
      const right = new THREE.Mesh(geometry, this.basicMat)
      right.position.x = (w / 2) - (b / 2)
      frame.add(right)
      geometry = new THREE.BoxBufferGeometry(w, b, d)
      const botttom = new THREE.Mesh(geometry, this.basicMat)
      botttom.position.y = (-h / 2) + (b / 2)
      frame.add(botttom)
      const top = new THREE.Mesh(geometry, this.basicMat)
      top.position.y = (h / 2) - (b / 2)
      frame.add(top)

      // art
      geometry = new THREE.PlaneBufferGeometry(w - b - m * 2, h - b - m * 2, 1)
      const art = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: txt }))
      art.position.set(0, 0, (-d / 2) + 0.01)
      frame.add(art)

      // glass
      geometry = new THREE.PlaneBufferGeometry(w - b, h - b, 1)
      const glass = new THREE.Mesh(geometry, this.glassMat)
      glass.position.z = (-d / 2) + 0.02
      frame.add(glass)
      if (callback) callback(frame)
    })
  }
}
if (typeof module !== 'undefined') module.exports = PictureFrame
