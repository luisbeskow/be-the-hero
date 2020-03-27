const connection = require('../database/connection');

module.exports = {
    // Listar os casos
    async index (request, response) {
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ]);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    // Criar um caso
    async create (request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;
        
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },

    // Deletar um caso
    async delete (request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        // Se o incidente não existir
        if (incident == undefined) {
            return response.status(404).json({ error: `This incident doesn't exists`});
        }

        // Se a ong logada não for a que criou o caso a ser deletado
        if (incident.ong_id !== ong_id) {
            return response.status(401).json({ error: 'Operation not permited.' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
};