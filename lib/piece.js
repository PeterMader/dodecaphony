const Piece = class {

  constructor () {
    this.notes = []
    this.duration = 0
    this.startTime = 0

    this.velocity = 1
    this.volume = 1
  }

  getNotes () {
    return this.notes.map((note) => note.calculate())
  }

  addNote (note) {
    if (note instanceof Note) {
      this.notes.push(note)
    }
  }

  addNotes () {
    let index
    for (index in arguments) {
      const note = arguments[index]
      if (note instanceof Note) {
        this.notes.push(note)
      }
    }
  }

  setVelocity (velocity) {
    if (typeof velocity === 'number' && velocity > 0) {
      this.duration /= velocity / this.velocity
      this.velocity = velocity
    }
  }

  setVolume (volume) {
    if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
      this.volume = volume
    }
  }

  start (startTime) {
    this.duration = this.getDuration() / this.velocity
    this.startTime = startTime
  }

  getDuration () {
    return this.notes.reduce((acc, note) => {
      return Math.max(acc, note.startTime + note.duration)
    }, 0)
  }

}
