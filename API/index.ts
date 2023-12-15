require('dotenv').config();
import * as express from 'express';
import * as bodyParser from 'body-parser';
import routes from './routes/route';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', routes);

const port = process.env.PORT || 4201;

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})