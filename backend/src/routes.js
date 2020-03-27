const express = require('express');

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

routes.post('/sessions', SessionController.create);

routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);

routes.get('/profile', ProfileController.index);

routes.get('/incidents', IncidentController.index);
routes.post('/incidents', IncidentController.create);
routes.delete('/incidents/:id', IncidentController.delete);
/**
 * Rota para deletar uma ong (teste)
 */
// routes.delete('/ongs', async (request, response) => {
//     const { id } = request.body;

//     await connection('ongs')
//         .where('id', id)
//         .del()
//     return response.json(`${id} was deleted`);
// });

routes.get('/', (request, response) => {
    return response.send(`It's working`);
})

module.exports = routes;