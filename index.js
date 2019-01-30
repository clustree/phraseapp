const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { PhraseAppClient} = require('./client');

require('yargs')
  .usage('$0 <cmd> [args]')
  .command(
    'pull',
    'Pull translations',
    yargs => {
      yargs.option('path', {
        type: 'string',
        describe: 'the folder that contains phraseapp config',
        demandOption: true,
      });
    },
    async argv => {
      const dir = path.join(process.cwd(), argv.path);
      const yml = yaml.safeLoad(
        fs.readFileSync(path.join(dir, '.phraseapp.yml'))
      );
      const phraseAppClient = new PhraseAppClient(yml.phraseapp, dir);
      await phraseAppClient.pull();
    }
  )
  .command(
    'push',
    'Push translations',
    yargs => {
      yargs.option('path', {
        type: 'string',
        describe: 'the folder that contains phraseapp config',
        demandOption: true,
      });
    },
    async argv => {
      const dir = path.join(process.cwd(), argv.path);
      const yml = yaml.safeLoad(
        fs.readFileSync(path.join(dir, '.phraseapp.yml'))
      );
      const phraseAppClient = new PhraseAppClient(yml.phraseapp, dir);
      await phraseAppClient.push();
    }
  )
  .help().argv;
