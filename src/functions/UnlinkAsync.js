const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const UnlinkAsync = async (path) => await unlinkAsync(path)

module.exports = UnlinkAsync;