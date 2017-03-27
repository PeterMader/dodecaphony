const Player = class extends EventEmitter {

  constructor (options) {
    super()

    const settings = typeof options === 'object' ? options : {}

    const audio = this.audio = new AudioContext() // TODO: check if AudioContext is supported
    this.notes = []
    this.piece = null

    this.velocity = 1
    this.paused = false
    this.pauseTime = 0

    this.resourcesLoaded = true

    this.oscillators = {}
    this.emit('ready')

    this.frame = 0
  }

  setPiece (piece) {
    if (piece instanceof Piece) {
      this.piece = piece
    }
  }

  play () {
    const {piece} = this
    const {currentTime} = this.audio

    if (!(piece instanceof Piece)) {
      return
    }

    if (!this.resourcesLoaded) {
      this.on('ready', this.play.bind(this))
    }

    if (this.paused) {
      this.paused = false
      piece.startTime += currentTime - this.pauseTime
      window.requestAnimationFrame(this._tick.bind(this))
      return
    }

    this.notes = piece.notes
    this.notes.forEach((note) => {
      note.hasBeenPlayed = false
    })

    this.piece.start(currentTime)
    window.requestAnimationFrame(this._tick.bind(this))

    this.emit('play')
  }

  pause () {
    this.paused = true
    this.pauseTime = this.audio.currentTime
    window.cancelAnimationFrame(this.frame)
  }

  togglePause () {
    if (this.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  stop () {
    window.cancelAnimationFrame(this.frame)
    this.piece.startTime = -this.piece.duration
  }

  loop (count) {
    if (typeof count === 'number' && (count === -1 || count > 0)) {
      this.once('finish', this.loop.bind(this, count === -1 ? count : count - 1))
      this.play()
    }
  }

  playNote (note) {
    const {audio} = this
    const {currentTime} = audio

    if (note.frequency < 0) {
      return
    }

    const oscillator = audio.createOscillator()
    oscillator.frequency.value = note.frequency
    if (note.type === Note.types.WAVE) {
      const real = new Float32Array(note.soundData)
      const imag = new Float32Array(real.length)
      const wave = audio.createPeriodicWave(real, imag)
      oscillator.setPeriodicWave(wave)
    } else {
      oscillator.type = note.type
    }

    const envelope = audio.createGain()
    envelope.gain.value = note.volume

    oscillator.connect(envelope)
    envelope.connect(audio.destination)

    oscillator.start(currentTime)
    oscillator.stop(currentTime + note.duration)

    this.emit('note', note)
  }

  _tick () {
    this.frame = window.requestAnimationFrame(this._tick.bind(this))
    const {audio, notes, piece} = this
    const {currentTime} = audio

    if (currentTime - piece.startTime > piece.duration) {
      window.cancelAnimationFrame(this.frame)
      this.emit('finish')
      return
    }

    this.emit('tick')

    let index
    for (index in notes) {
      const note = notes[index]
      const startTime = note.startTime / piece.velocity + piece.startTime

      if (startTime > currentTime || note.hasBeenPlayed) {
        continue
      }

      note.hasBeenPlayed = true

      note.volume *= piece.volume
      note.duration /= piece.velocity
      this.playNote(note)
      note.volume /= piece.volume
      note.duration *= piece.velocity
    }
  }
}
