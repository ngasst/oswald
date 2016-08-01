import { readJSON } from 'fs-extra';
import { join } from 'path';
export function getAuthorizedHosts() {
    let cfg: string = join(__dirname, '../cfg/config.json');
    return new Promise((resolve: any, reject: any) => {
        readJSON(cfg, (err: Error, config) => {
            if(err) { reject(err)}
            resolve(config);
        });
    });
}