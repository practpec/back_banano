import express from 'express';
import cors from 'cors';
import UserRoute from './src/users/infrestructure/routes/user.router';


const app = express();

const PORT = '3000';

let corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/users', UserRoute);

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto', PORT)
})