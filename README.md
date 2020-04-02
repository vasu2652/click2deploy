click2deploy
============

Elegant CLI application to Deploy

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/click2deploy.svg)](https://npmjs.org/package/click2deploy)
[![Downloads/week](https://img.shields.io/npm/dw/click2deploy.svg)](https://npmjs.org/package/click2deploy)
[![License](https://img.shields.io/npm/l/click2deploy.svg)](https://github.com/cli/click2deploy/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g click2deploy
$ click2deploy COMMAND
running command...
$ click2deploy (-v|--version|version)
click2deploy/0.0.0 linux-x64 node-v10.18.0
$ click2deploy --help [COMMAND]
USAGE
  $ click2deploy COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`click2deploy deploy`](#click2deploy-deploy)
* [`click2deploy help [COMMAND]`](#click2deploy-help-command)

## `click2deploy deploy`

Elegant Deployment: Configure in less than Minute

```
USAGE
  $ click2deploy deploy

OPTIONS
  -c, --config=config  Absolute Path of the Config File

DESCRIPTION
  ...
  click2deploy is a CLI based application which can be used to deploy any github, gitlab, bitbucket codebases to deploy 
  easily just by configuring few parameters.

  click2deploy internally uses shipit-deploy module and acts a wrapper to simplify deployment of any application with 
  very less configuration

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
         "keepReleases": "Number of Releases Which you wish to maintain in the Server to Rollback if there is an error 
  in current release deployment",
         "shallowClone": "Clone only the last commit of the repository(Type: Boolean, default true)",
         "branch": "Git Branch",
         "verboseSSHLevel":SSH verbosity level to use when connecting to remote servers. 0 (none), 1 (-v), 2 (-vv), 3 
  (-vvv),
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
```

_See code: [src/commands/deploy.js](https://github.com/cli/click2deploy/blob/v0.0.0/src/commands/deploy.js)_

## `click2deploy help [COMMAND]`

display help for click2deploy

```
USAGE
  $ click2deploy help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
