import yargs from 'yargs/yargs'
import FileParserService from './services/FileParserService'
import * as fs from 'fs'

/***
 * Yargs to help capture the params sent at command line before executig the main program
 */
const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --filename [string]')
  .option('filename', {
    alias: 'f',
    describe: 'Must select wich log file to parse the data',
    type: 'string',
    demandOption: true,
  })
  .check((argv) => {
    try {
      fs.accessSync(`${__dirname}/${argv.filename}`)
      return true
    } catch (e) {
      throw new Error('filenameError')
    }
  })
  .fail(function (msg, err, yargs) {
    console.error('\x1b[31m%s\x1b[0m', 'Error executing the command line:')
    if (err.message === 'filenameError') {
      console.error(
        '\x1b[31m%s\x1b[0m',
        `Could not read the specified file or the file does not exist`
      )
    } else {
      console.error('\x1b[31m%s\x1b[0m', msg)
      console.error('You should be doing', yargs.help())
      console.error('\n\nIf using npm then:\n\nnpm start -- --filename [string]\n\n')
      if (err) throw err // preserve stack
    }
    process.exit()
  }).argv

/**
 * The main execution program
 */
const main = async (filename: string) => {
  const fileParserService: FileParserService = new FileParserService()
  return await fileParserService.evaluate(`${__dirname}/${filename}`)
}

main(argv.filename)
  .then((data) => {
    console.log('\x1b[36m%s\x1b[0m', '-------------------------------------------------')
    console.log('\x1b[36m%s\x1b[0m', 'Done parsing the file! And these are the results:')
    console.log('\x1b[36m%s\x1b[0m', '-------------------------------------------------\n')
    console.log(data);
    return;
  })
  .catch((err) => {
    console.log  ('\x1b[31m%s\x1b[0m', '-----------------------------------------------------')
    console.error('\x1b[31m%s\x1b[0m', 'Could not parse the logs file: something happened :-(')
    console.log  ('\x1b[31m%s\x1b[0m', '-----------------------------------------------------\n')
    console.error(err)
  })