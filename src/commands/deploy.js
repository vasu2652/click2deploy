const { Command, flags } = require('@oclif/command')
const Shipit = require('../lib/shipit')
const initDeploy = require('shipit-deploy')
const inquirer = require('inquirer')
const fs = require('fs')
const util = require('util')
const readDir = util.promisify(fs.readdir)
const configGenerator = async () => {
  const questionsJSON = JSON.parse(fs.readFileSync('./src/lib/questions.json'));
  let questions = Object.keys(questionsJSON).reduce((agg, key) => {
    let when = true;
    if (questionsJSON[key]['depends_on'] && questionsJSON[key]['depends_on'].length) {

      when = (answers) => questionsJSON[key].depends_on.map(ele => answers[ele]).includes(false) ? false : true
    }
    return [
      ...agg,
      {
        ...questionsJSON[key],
        name: key,
        when
      }
    ]
  }, [])
  const answers = await inquirer.prompt(questions)
  let shipit_config = {
    [answers['environment']]: {
      servers: answers['servers']
    },
    default: {
      ...answers,
      ignores: answers['ignores'].split(',')
    }
  }
  delete shipit_config.default.RequireSSHKey
  delete shipit_config.default.environment
  delete shipit_config.default.servers
  return shipit_config
}
const generateChoice = async (files) => {
  return files
}
const validateConfig = async () => {

}
class DeployCommand extends Command {
  async exit(code) {
    if (process.platform === 'win32' && process.stdout.bufferSize) {
      process.stdout.once('drain', () => {
        process.exit(code)
      })
      return
    }

    process.exit(code)
  }

  async deploy(config, bashFilePath) {
    let shipit = new Shipit({ environment: config.default.environment })
    initDeploy(shipit)
    this.log(config, bashFilePath)
    shipit.initConfig(config)
    shipit.on('published', () => {
      shipit.start([
        'restart'
      ])
    })
    shipit.blTask('restart', async () => {
      await shipit.remote(`cd ${shipit.releasePath} && chmod +x ${bashFilePath}`)
      await shipit.remote(`cd ${shipit.releasePath} && ${bashFilePath}`)
      shipit.log('Applications have been restarted')
    })
    shipit.initialize();
    shipit.on('task_err', () => exit(1))
    shipit.on('task_not_found', () => exit(1))
    shipit.start(['deploy'])
  }
  async run() {
    try {
      const { flags } = this.parse(DeployCommand)
      this.log(flags)
      let shipit_config = {};
      let config_path;
      //check if a config file path is provided
      if (flags.config) {
        //check if the file path is valid
        if (fs.existsSync(flags.config)) {
          //validate the config file 
          shipit_config = JSON.parse(fs.readFileSync(flags.config))
        }
        else {
          throw new Error('Please Provide a Valid File Path')
        }
      }
      else {
        /**
         * Show user list of config's which are already present and ask user to select one or last option would be create a new one.
         * If a user selects an existing config show user the config file and ask if he wants to continue or create a new one.
         * After creating a new one save it with the filename he provides
         */
        const files = await readDir('./src/shipit-config/')
        let choice = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedConfig',
            message: 'Select the Existing config or Create a New one.',
            choices: [...await generateChoice(files), 'Create New']
          }
        ])
        config_path = `./src/shipit-config/${choice.selectedConfig}`
        if (fs.existsSync(config_path)) {
          shipit_config = JSON.parse(fs.readFileSync(config_path))
          this.log(shipit_config)
          let choice = await inquirer.prompt([
            {
              type: 'confirm',
              message: 'Do you wish to continue with the current config?',
              name: 'val'
            }
          ]);
          if (!choice.val) {
            shipit_config = await configGenerator()
            if (shipit_config.default.saveConfig) {
              config_path = config_path.replace('Create New', shipit_config.default.configFileName)
              config_path = config_path.endsWith('.json') ? config_path : `${config_path}.json`;
              delete shipit_config.default.configFileName 
              fs.writeFile(config_path, JSON.stringify(shipit_config, null, 4), () => this.log('Shipit Config File Created', shipit_config))
            }
          }
        }
        else {
          shipit_config = await configGenerator()
          if (shipit_config.default.saveConfig) {
            config_path = config_path.replace('Create New', shipit_config.default.configFileName)
            config_path = config_path.endsWith('.json') ? config_path : `${config_path}.json`;
            delete shipit_config.default.configFileName 
            fs.writeFile(config_path, JSON.stringify(shipit_config, null, 4), () => this.log('Shipit Config File Created', shipit_config))
          }
          else {
            delete shipit_config.default.saveConfig
          } 
        }
      }
      this.log(shipit_config)
      //this.deploy(shipit_config, shipit_config.default.environment)
    } catch (error) {
      this.log(error.message, error)
    }
  }
}

DeployCommand.description = `For documentation https://github.com/vasu2652/click2deploy`

DeployCommand.flags = {
  config: flags.string({ char: 'c', description: 'Absolute Path of the Config File' }),
  filename: flags.string({ char: 'f', description: 'Config file name which you have created before' }),
}

module.exports = DeployCommand
