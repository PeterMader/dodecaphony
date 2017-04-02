const Note = class {

  constructor (options) {

    let settings = typeof options === 'object' ? options : {}

    this.frequency = 0
    this.startTime = 0
    this.duration = 1
    this.volume = .5
    this.type = Note.types.SINE
    this.name = 'A'
    this.wave = []
    this.envelope = []

    if (typeof settings.frequency === 'number') {
      this.setFrequency(settings.frequency)
    } else if (typeof settings.halfTones === 'number') {
      this.setFrequency(Note.halfTonesToFrequency(settings.halfTones))
    }

    this.setStartTime(settings.startTime)
    this.setDuration(settings.duration)
    this.setVolume(settings.volume)
    this.setType(settings.type, settings)
    this.setEnvelope(settings.envelope)
    this.setName(settings.name)
  }

  setFrequency (frequency) {
    if (typeof frequency === 'number') {
      this.frequency = frequency
    }
    return this
  }

  setName (name) {
    if (typeof name === 'string') {
      this.name = name
    }
    return this
  }

  setFrequencyFromHalfTones (halfTones) {
    this.setFrequency(Note.halfTonesToFrequency(halfTones))
    return this
  }

  setStartTime (startTime) {
    if (typeof startTime === 'number' && startTime > 0) {
      this.startTime = startTime
    }
    return this
  }

  setDuration (duration) {
    if (typeof duration === 'number' && duration > 0) {
      this.duration = duration
    }
    return this
  }

  setVolume (volume) {
    if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
      this.volume = volume
    }
    return this
  }

  setType (type, soundData) {
    let index
    for (index in Note.types) {
      if (type === Note.types[index]) {
        this.type = type
        break
      }
    }
    if (this.type === Note.types.WAVE) {
      this.wave = Array.isArray(soundData.wave) ? soundData.wave : []
    } else {
      this.wave = []
    }
    return this
  }

  setEnvelope (envelope) {
    this.envelope = new Float32Array(Array.isArray(envelope) ? envelope : [])
    return this
  }

  clone () {
    return new Note(this.getData())
  }

  getData () {
    return {
      frequency: this.frequency,
      duration: this.duration,
      volume: this.volume,
      type: this.type,
      wave: this.wave,
      envelope: this.envelope,
      name: this.name,
      hasBeenPlayed: false
    }
  }

  static halfTonesToFrequency (halfTones) {
  	return Math.round(440 * Math.pow(2, halfTones / 12))
  }

  static halfTonesToName (halfTones) {
    let h = halfTones
    let octave = 4
    while (h < 0) {
      h += 12
      octave -= 1
    }
    while (h > 11) {
      h -= 12
      octave += 1
    }
    return Note.halfToneNames[h] + octave
  }

}

Note.types = {
  SINE: 'sinus',
  TRIANGLE: 'triangle',
  SQUARE: 'square',
  WAVE: 'wave'
}

Note.halfToneNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
