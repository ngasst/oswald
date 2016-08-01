import * as express from 'express';
import * as cors from 'cors';
import { getAuthorizedHosts } from './authorized-hosts';

let port: number = process.env.PORT || 6132;
let app: express.Application = express();

getAuthorizedHosts().then((hosts: any[]) => {
    app.use(cors(hosts));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    
})

