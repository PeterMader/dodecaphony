const Dodecaphony = class extends Piece {

  constructor () {
    super()

    this.primeRowHalfTones = Dodecaphony.createPrimeRow()
    this.rowNames = ['Prime row']
    this.rows = [this.primeRowHalfTones]
  }

  create (rowCount) {
    let i, j
    let accRow = this.primeRowHalfTones
    for (i = 0; i < rowCount; i += 1) {
      const volume = Math.random() * .5 + .2
      for (j = 0; j < 12; j += 1) {
        const halfTones = Dodecaphony.maybeTransposeNote(accRow[j])
        const frequency = Note.halfTonesToFrequency(halfTones)
        const note = new Note({
          startTime: i * 12 + Math.random() * 6 - 4 + j,
          duration: 4 / Math.round(Math.random() * 7 + 1), // random float from 1/8 to 1/1
          frequency,
          volume,
          type: Dodecaphony.randomNoteType(),
          envelope: [0, 0, .05, .9, .2, 1, .9, .9, 1, 0],
          name: Note.halfTonesToName(halfTones)
        })

        if (Math.random() < .1) {
          note.duration = .25
          const length = Math.round(Math.random() * 2) + 2 // random int from 2 to 4
          let i
          for (i = 0; i < length; i += 1) {
            this.addNote(note.clone().setStartTime(note.startTime + .3 * i))
          }
        } else {
          this.addNote(note)
        }
      }
      if (i < rowCount - 1) {
        accRow = this.randomTransformation(accRow)
        this.rows.push(accRow)
      }
    }
  }

  static maybeTransposeNote (halfTones) {
    const random = Math.random()
    if (random < .1) {
      return halfTones + 12
    } else if (random < .2) {
      return halfTones - 12
    }
    return halfTones
  }

  randomTransformation (row) {
    const random = Math.random()
    if (random < .4) {
      const interval = Math.round(Math.random() * 6) - 3
      this.rowNames.push(`Transposition (${interval})`)
      return Dodecaphony.transposeRow(row, interval)
    }
    if (random < .7) {
      this.rowNames.push('Retrograde')
      return Dodecaphony.retrograde(row)
    }
    this.rowNames.push('Inversion')
    return Dodecaphony.invert(row)
  }

  static createPrimeRow () {
    // create a random sequence of unique integers from 0 to 11 and return it
    const primeRow = [...Array(12).keys()]
    let i
    for (i = 12; i; i -= 1) {
      const otherIndex = Math.floor(Math.random() * i)
      const temp = primeRow[otherIndex]
      primeRow[otherIndex] = primeRow[i - 1]
      primeRow[i - 1] = temp
    }
    return primeRow
  }

  static transposeRow (row, halfTones) {
    return row.map((value) => value + halfTones)
  }

  static retrograde (row) {
    return row.slice().reverse()
  }

  static invert (row) {
    const first = row[0]
    const {length} = row
    const result = row.slice()
    let i
    for (i = 1; i < length; i += 1) {
      result[i] = 2 * first - row[i]
    }
    return result
  }

  static randomNoteType () {
    const random = Math.random()
    if (random < .5) {
      return Note.types.SQUARE
    }
    if (random < .9) {
      return Note.types.TRIANGLE
    }
    return Note.types.SINE
  }

}
