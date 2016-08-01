import * as express from 'express';
import { outputJSON } from 'fs-extra';
import { join, resolve } from 'path';
import { which, exec, ExecOutputReturnValue, exit, cd } from 'shelljs';
import { ChildProcess } from 'child_process';
import * as moment from 'moment';
import { ILogFile, IStep } from '../models/redeploy.model';


export class RedeployController {
    static run: (req: express.Request, res: express.Response) => void = (req: express.Request, res: express.Response) => {
        let service = req.params['service'];
        let repo = req.params['repo'];
        let compFile = req.params['compose'];
        let logOutput: ILogFile = {
            name: `${moment().unix()}-${repo}-${service}`,
            steps: []
        };
        if (!which('git')) {
            let output =+ `Git is not installed. Oswald requires Git in order to function!`;
        }

        goToRepo(repo);

        gitPull(repo).then((gitStep: IStep) => {
            logOutput.steps.push(gitStep);
            dockerStop(compFile, service).then((dockerStopStep: IStep) => {
                logOutput.steps.push(dockerStopStep);
                dockerPull(compFile, service).then((dockerPullStep: IStep) => {
                    logOutput.steps.push(dockerPullStep);
                    dockerUp(compFile, service).then((dockerUpStep: IStep) => {
                        logOutput.steps.push(dockerUpStep);
                        logFile(logOutput);
                        res.render(`<h2>Done!!</h2>`);
                    }).catch((err: IStep) => {
                        logOutput.steps.push(err);
                        logFile(logOutput);
                    });
                }).catch((err: IStep) => {
                    logOutput.steps.push(err);
                    logFile(logOutput);
                });
            }).catch((err: IStep) => {
                logOutput.steps.push(err);
                logFile(logOutput);
            });
        }).catch((err: IStep) => {
            logOutput.steps.push(err);
            logFile(logOutput);
        });
    }
}

function goToRepo(repo: string) {
    let path: string = resolve(`/root/${repo}`);
    cd(path);
}

function logFile(output: ILogFile) {
    let date: string = moment().format('fullDate');
    let path: string = join(__dirname, `../data/${date}.json`);
    outputJSON(path, output, (err: Error) => {
        if(err) {console.log('There was an error writing the output file!');}
    });
}

function dockerStop(dockerComposeName: string, dockerServiceName: string): Promise<any> {
    let step: IStep = {
        name: `Stop Docker Service ${dockerServiceName}`,
        started: moment().toDate()
    };
    return new Promise((resolve: any, reject: any) => {
        exec(`docker-compose -f ${dockerComposeName} ${dockerServiceName} stop`, (code, stdout, stderr) => {
            if (stderr) {
                let output: string = stderr;
                step.ended = moment().toDate();
                step.error = true;
                step.outpout = output;
                reject(step);
                exit(code);
            }

            step.ended = moment().toDate();
            step.error = false;
            step.outpout = stdout;
            resolve(step);
        });
    });
}

function dockerPull(dockerComposeName: string, dockerServiceName: string): Promise<any> {
    let step: IStep = {
        name: `Pull Docker Image ${dockerServiceName}`,
        started: moment().toDate()
    };
    return new Promise((resolve: any, reject: any) => {
        exec(`docker-compose -f ${dockerComposeName} ${dockerServiceName} pull`, (code, stdout, stderr) => {
            if (stderr) {
                let output: string = stderr;
                step.ended = moment().toDate();
                step.error = true;
                step.outpout = output;
                reject(step);
                exit(code);
            }
        step.ended = moment().toDate();
        step.error = false;
        step.outpout = stdout;
        resolve(step);
        });
    });
}


function dockerUp(dockerComposeName: string, dockerServiceName: string): Promise<any> {
    let step: IStep = {
        name: `Up Docker Service ${dockerServiceName}`,
        started: moment().toDate()
    };
    return new Promise((resolve: any, reject: any) => {
        exec(`docker-compose -f ${dockerComposeName} ${dockerServiceName} up`, (code, stdout, stderr) => {
            if (stderr) {
                let output: string = stderr;
                step.ended = moment().toDate();
                step.error = true;
                step.outpout = output;
                reject(step);
                exit(code);
            }
        step.ended = moment().toDate();
        step.error = false;
        step.outpout = stdout;
        resolve(step);
        });
    });
}



function gitPull(repo: string): Promise<any> {
     let step: IStep = {
        name: `Pull Git Repo ${repo}`,
        started: moment().toDate()
    };
    return new Promise((resolve: any, reject: any) => {
        exec(`git pull -u origin master`, {silent: true, async: true}, (code, stdout: string, stderr:string) => {
            if (stderr) {
                let output: string = stderr;
                step.ended = moment().toDate();
                step.error = true;
                step.outpout = output;
                reject(step);
                exit(code);
            }

            step.ended = moment().toDate();
            step.error = false;
            step.outpout = stdout;
            resolve(step);
        });
    });
}