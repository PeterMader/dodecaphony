const ResourceLoader = class {

  static loadBuffer (context, path) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    xhr.responseType = 'arraybuffer'

    const promise = new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            context.decodeAudioData(xhr.response).then(resolve).catch(reject)
          } else {
            reject(xhr.status)
          }
        }
      }
    })

    xhr.send()
    return promise
  }

}
