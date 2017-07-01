var fs = require('fs')

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err)
      return
    }

    const data = {}

    filenames.forEach(filename => {
      data[filename] = fs.readFileSync(dirname + filename, 'utf-8')
    })

    // console.log(data)

    onFileContent(data)
  })

  return 42
}

module.exports = readFiles