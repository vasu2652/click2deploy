click2deploy
============

Elegant CLI application to Deploy

[![Version](https://img.shields.io/npm/v/click2deploy.svg)](https://npmjs.org/package/click2deploy)
[![Downloads/week](https://img.shields.io/npm/dw/click2deploy.svg)](https://npmjs.org/package/click2deploy)
[![License](https://img.shields.io/npm/l/click2deploy.svg)](https://github.com/cli/click2deploy/blob/master/package.json)

<!-- toc -->
* [installation](#install)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Install
```
$ npm install click2deploy
```
# Usage
<!-- usage -->
```

$ click2deploy COMMAND

$ click2deploy (-v|--version|version)

$ click2deploy --help [COMMAND]

```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`click2deploy deploy`](#click2deploy-deploy)
* [`click2deploy help [COMMAND]`](#click2deploy-help-command)

## `click2deploy deploy`

When executed, will prompt you a bunch of questions which all are mandatory to complete the deployment of the application.

Alternatively you can provide the absolute path of the existing [` config file`](#CONFIG-FILE) in json format exactly in
the below format.

click2deploy internally uses shipit module and acts a wrapper to simplify deployment of any application with very less configuration.

<!--head-->
## How It Works
click2deploy pulls the latest code from provided git url and copies into the provided remote directory.
After copying it executes a bash file which is present in the remote server. 
You can maintain the bash file to build application, install dependencies, start the process.
<!--head-->
<!-- head-->
### Usage
<!-- head-->
```
  $ click2deploy deploy
```
<!-- head-->
### Options
<!-- head-->
```
  -c, --config=config  Absolute Path of the Config File
```
<!-- question-->
### Configuration
<!-- question-->
<!--param-->
#### deployTo
<!--param-->
Directory where the code will be deployed on remote servers.

<!--param-->
#### repositoryUrl
<!--param-->
Repository URL to clone, must be defined using https or git+ssh format.

<!--param-->
#### ignores
<!--param-->
[
			"List of files excluded in copyFromRemote or copyToRemote methods."
]
<!--param-->
#### keepReleases
<!--param-->
Number of Releases Which you wish to maintain in the Server to Rollback if there is an error  in current release deployment ",
		
<!--param-->
#### shallowClone
<!--param-->
Clone only the last commit of the repository(Type: Boolean, default true)",
		
<!--param-->
#### RequireSSHKey
<!--param-->
Do you want to provide .pem file to access your remote server (Recommended to add the remote host into known hosts in your system by performing ssh-copy-id)
<!--param-->
#### branch
<!--param-->
Git Branch

<!--param-->
#### verboseSSHLevel:
<!--param-->
SSH verbosity level to use when connecting to remote servers.0(none) 1(-v),2(-vv),3(-vvv)"
	
<!--param-->
#### Environment
<!--param-->
Environment of deployment(Can be anything)

<!--param-->
#### Key
<!--param-->
Path of the pem file (Will be asked if RequireSSHKey is true)

<!--param-->
#### Servers
<!--param-->
user@host:port

<!--param-->
#### BashFilePath
<!--param-->
Path of bash script which will be executed afte copying the code to remote server.
This can be used to 
1.Build you application or Generate Executables
2.Install your dependencies
3.Start the process using pm2 etc..
Check How it works Section to understand
<!-- head-->
### `CONFIG FILE`
<!-- head-->
```
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
		"keepReleases": "Number of Releases Which you wish to maintain in the Server to Rollback if there is an error  in current release deployment ",
		"shallowClone": "Clone only the last commit of the repository(Type: Boolean, default true)",
		"branch": "Git Branch",
		"verboseSSHLevel": "SSH verbosity level to use when connecting to remote servers.0(none) 1(-v),2(-vv),3(-vvv)"
	},
	"uat": {
		"branch": "master",
		"Key": "Path to SSH key.",
		"servers": "uat@uat.server.com"
	}
}
```

_See code: [src/commands/deploy.js]

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
