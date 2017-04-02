const player = new Player()
const dodecaphony = new Dodecaphony()
// const dodecaphony = new Piece()

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start').addEventListener('click', player.play.bind(player))
  document.getElementById('toggle-pause').addEventListener('click', player.togglePause.bind(player))
  const notesContainer = document.getElementById('notes')

  dodecaphony.create(10)
  // const note = new Note({
  //   halfTones: 0,
  //   duration: 4,
  //   volume: .5,
  //   startTime: 0,
  //   type: Note.types.TRIANGLE,
  //   envelope: [0, 0, .05, .9, .2, 1, .9, .9, 1, 0],
  // })
  //
  // dodecaphony.addNotes(note, note.clone().setEnvelope([]).setStartTime(4))

  dodecaphony.setVelocity(2)
  player.setPiece(dodecaphony)

  player.on('error', console.log)
  player.on('play', () => {
    while (notesContainer.firstChild) {
      notesContainer.removeChild(notesContainer.firstChild)
    }
    row = document.createElement('tr')
    const tableHead = document.createElement('td')
    tableHead.textContent = dodecaphony.rowNames[0]
    row.appendChild(tableHead)
    notesContainer.appendChild(row)
    rowCount = 1
    played = []
  })

  let row = null, i = 0, rowCount = 1, played = []
  player.on('note', (note) => {
    i += 1

    if (played.indexOf(note.name) !== -1) {
      i -= 1
    } else {
      played.push(note.name)
    }
    const tableData = document.createElement('td')
    tableData.textContent = note.name
    row.appendChild(tableData)

    if (i >= dodecaphony.rows[rowCount].length) {
      row = document.createElement('tr')
      const tableHead = document.createElement('td')
      tableHead.textContent = dodecaphony.rowNames[rowCount]
      row.appendChild(tableHead)
      notesContainer.appendChild(row)
      rowCount += 1
      played = []
      i = 0
    }
  })
})
