"use strict";
const fs_extra_1 = require('fs-extra');
const path_1 = require('path');
const shelljs_1 = require('shelljs');
const moment = require('moment');
class RedeployController {
}
RedeployController.run = (req, res) => {
    let service = req.params['service'];
    let repo = req.params['repo'];
    let image = req.params['image'];
    let compFile = req.params['compose'];
    let logOutput = {
        name: `${moment().unix()}-${repo}-${image}`,
        steps: []
    };
    if (!shelljs_1.which('git')) {
        let output = +`Git is not installed. Oswald requires Git in order to function!`;
    }
    gitPull(repo).then((gitStep) => {
        logOutput.steps.push(gitStep);
        dockerStop(compFile, service).then((dockerStopStep) => {
            logOutput.steps.push(dockerStopStep);
            dockerPull(compFile, image).then((dockerPullStep) => {
                logOutput.steps.push(dockerPullStep);
                dockerUp(compFile, service).then((dockerUpStep) => {
                    logOutput.steps.push(dockerUpStep);
                    logFile(logOutput);
                }).catch((err) => {
                    logOutput.steps.push(err);
                    logFile(logOutput);
                });
            }).catch((err) => {
                logOutput.steps.push(err);
                logFile(logOutput);
            });
        }).catch((err) => {
            logOutput.steps.push(err);
            logFile(logOutput);
        });
    }).catch((err) => {
        logOutput.steps.push(err);
        logFile(logOutput);
    });
};
exports.RedeployController = RedeployController;
function logFile(output) {
    let date = moment().format('fullDate');
    let path = path_1.join(__dirname, `../data/${date}.json`);
    fs_extra_1.outputJSON(path, output, (err) => {
        if (err) {
            console.log('There was an error writing the output file!');
        }
    });
}
function dockerStop(dockerComposeName, dockerServiceName) {
    let step = {
        name: `Stop Docker Service ${dockerServiceName}`,
        started: moment().toDate()
    };
    return new Promise((resolve, reject) => {
        shelljs_1.exec(`docker-compose -f ${dockerComposeName} ${dockerServiceName} stop`, (code, stdout, stderr) => {
            if (stderr) {
                let output = stderr;
                step.ended = moment().toDate();
                step.error = true;
                step.outpout = output;
                reject(step);
                shelljs_1.exit(code);
            }
            step.ended = moment().toDate();
            step.error = false;
            step.outpout = stdout;
            resolve(step);
        });
    });
}
function dockerPull(dockerComposeName, dockerImageName) {
    let step = {
        name: `Pull Docker Image ${dockerImageName}`,
        started: moment().toDate()
    };
    return new Promise((resolve, reject) => {
        shelljs_1.exec(`docker-compose -f ${dockerComposeName} ${dockerImageName} pull`, (code, stdout, stderr) => {
            if (stderr) {
                let output = stderr;
                step.ended = moment().toDate();
                step.error = true;
                step.outpout = output;
                reject(step);
                shelljs_1.exit(code);
            }
            step.ended = moment().toDate();
            step.error = false;
            step.outpout = stdout;
            resolve(step);
        });
    });
}
function dockerUp(dockerComposeName, dockerServiceName) {
    let step = {
        name: `Up Docker Service ${dockerServiceName}`,
        started: moment().toDate()
    };
    return new Promise((resolve, reject) => {
        shelljs_1.exec(`docker-compose -f ${dockerComposeName} ${dockerServiceName} up`, (code, stdout, stderr) => {
            if (stderr) {
                let output = stderr;
                step.ended = moment().toDate();
                step.error = true;
                step.outpout = output;
                reject(step);
                shelljs_1.exit(code);
            }
            step.ended = moment().toDate();
            step.error = false;
            step.outpout = stdout;
            resolve(step);
        });
    });
}
function gitPull(repo) {
    let step = {
        name: `Pull Git Repo ${repo}`,
        started: moment().toDate()
    };
    return new Promise((resolve, reject) => {
        shelljs_1.exec(`git pull -u origin master`, { silent: true, async: true }, (code, stdout, stderr) => {
            if (stderr) {
                let output = stderr;
                step.ended = moment().toDate();
                step.error = true;
                step.outpout = output;
                reject(step);
                shelljs_1.exit(code);
            }
            step.ended = moment().toDate();
            step.error = false;
            step.outpout = stdout;
            resolve(step);
        });
    });
}
