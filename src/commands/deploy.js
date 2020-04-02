const { Command, flags } = require('@oclif/command')
const Shipit = require('../../lib/shipit')
const initDeploy = require('shipit-deploy')
const inquirer = require('inquirer')
const fs = require('fs')
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
      if (flags.config) {
        if (fs.existsSync(flags.config)) {
          shipit_config = JSON.parse(fs.readFileSync(flags.config))
        }
        else {
          throw new Error('Please Provide a Valid File Path')
        }
      } else {
        let configGenerator = async () => {
          const questionsJSON = JSON.parse(fs.readFileSync('questions.json'))
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
          return {
            [answers['environment']]: {
              servers: answers['servers']
            },
            default: {
              ...answers,
              ignores: answers['ignores'].split(',')
            }
          }
        }

        if (fs.existsSync('./shipit-config.json')) {
          shipit_config = JSON.parse(fs.readFileSync('./shipit-config.json'))
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
            fs.writeFile('./shipit-config.json', JSON.stringify(shipit_config, null, 4))
          }
        }
        else {
          shipit_config = await configGenerator()
          fs.writeFile('./shipit-config.json', JSON.stringify(shipit_config, null, 4), () => this.log('Shipit Config File Created', shipit_config))
        }
      }

      this.deploy(shipit_config, shipit_config.default.environment)
    } catch (error) {
      this.log(error.message, error)
    }
  }
}

DeployCommand.description = `Elegant Deployment: Configure in less than Minute
...
click2deploy is a CLI based application which can be used to deploy any github, gitlab, bitbucket codebases to deploy easily just by configuring few parameters.

click2deploy internally uses shipit-deploy module and acts a wrapper to simplify deployment of any application with very less configuration

click2deploy requires a json config file to deploy the application.

The sample config file looks like below json file

{ 
  "default": {
      "deployTo": "Directory where the code will be deployed on remote servers.",
      "repositoryUrl": "Repository URL to clone, must be defined using https or git+ssh format.",
      "ignores": [
          "List of files excluded in copyFromRemote or copyToRemote methods."
      ],
      "rsync": [
          "--del"
      ],
      "keepReleases": "Number of Releases Which you wish to maintain in the Server to Rollback if there is an error in current release deployment",
      "shallowClone": "Clone only the last commit of the repository(Type: Boolean, default true)",
      "branch": "Git Branch",
      "verboseSSHLevel":SSH verbosity level to use when connecting to remote servers. 0 (none), 1 (-v), 2 (-vv), 3 (-vvv),
  },
  "dev": {
      "branch": "master",
      "Key": "Path to SSH key.",
      "servers": "dev@dev.server.com"
  },
  "uat": {
    "branch": "master",
    "Key": "Path to SSH key.",
    "servers": "uat@uat.server.com"
},
  "prod": {
    "branch": "master",
    "Key": "Path to SSH key.",
    "servers": "prod@prod.server.com"
  }
}
`

DeployCommand.flags = {
  config: flags.string({ char: 'c', description: 'Absolute Path of the Config File' }),
}

module.exports = DeployCommand
