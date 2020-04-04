click2deploy
============

Elegant CLI application to Deploy

[![Version](https://img.shields.io/npm/v/click2deploy.svg)](https://npmjs.org/package/click2deploy)
[![Downloads/week](https://img.shields.io/npm/dw/click2deploy.svg)](https://npmjs.org/package/click2deploy)
[![License](https://img.shields.io/npm/l/click2deploy.svg)](https://github.com/cli/click2deploy/blob/master/package.json)

<!-- toc -->
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Install
```
$ npm install click2deploy
```
# Usage
<!-- usage -->
```sh-session
$ npm install -g click2deploy
$ click2deploy COMMAND
running command...
$ click2deploy (-v|--version|version)
click2deploy/0.0.8 linux-x64 node-v10.18.0
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

For documentation https://github.com/vasu2652/click2deploy

```
USAGE
  $ click2deploy deploy

OPTIONS
  -c, --config=config  Absolute Path of the Config File
```

_See code: [src/commands/deploy.js](https://github.com/vasu2652/click2deploy/blob/v0.0.8/src/commands/deploy.js)_

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
