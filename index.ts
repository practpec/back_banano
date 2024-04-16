import express from 'express';
import cors from 'cors';
import UserRoute from './src/users/infrestructure/routes/user.router';
import AuthRoute from './src/auth/infrestructure/routes/auth.router';
import NoticionesRoute from './src/notificaciones/infrestructure/routes/notificacion.route';
import RacimoRoute from './src/racimos/infrestructure/routes/racimo.route';
import ClimaticoRoute from './src/climaticos/infrestructure/routes/climaticos.route';

const app = express();

const PORT = '3000';

let corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/login', AuthRoute);
app.use('/users', UserRoute);
app.use('/notificaciones', NoticionesRoute);
app.use('/racimos', RacimoRoute);
app.use('/clima', ClimaticoRoute);

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto', PORT)
})