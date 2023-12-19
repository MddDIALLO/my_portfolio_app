require('dotenv').config();
import * as express from 'express';
import * as bodyParser from 'body-parser';
import routes from './routes/route';
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET,POST,OPTIONS,DELETE,PUT',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin',
    optionsSuccessStatus: 204,
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', routes);

const port = process.env.PORT || 4201;

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})