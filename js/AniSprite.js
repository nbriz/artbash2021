/* global THREE */
class AniSprite {
  constructor (opts) {
    this.len = opts.length || 1
    this.idx = 0
    this.fps = opts.fps || 1000 / 24
    this.delay = opts.delay || 0
    this.maps = []
    for (let i = 0; i < this.len; i++) {
      const path = `${opts.root}/${opts.name}${i}.${opts.type}`
      const map = new THREE.TextureLoader().load(path)
      this.maps.push(map)
    }
    const material = new THREE.SpriteMaterial({ map: this.maps[this.len - 1] })
    const sprite = new THREE.Sprite(material)
    this.mesh = sprite
    this.mesh.scale.set(0.5, 0.5, 0.5)
    setTimeout(() => this.update(opts), this.delay)
  }

  update (opts) {
    this.idx++; if (this.idx >= this.len) this.idx = 0
    this.mesh.material.map = this.maps[this.idx]
    if (this.idx === this.len - 1 && this.delay) {
      setTimeout(() => this.update(opts), this.delay)
    } else setTimeout(() => this.update(opts), this.fps)
  }
}

window.AniSprite = AniSprite
