import { QueryTypes } from 'sequelize';
import { error } from 'console';
import { Request, Response } from 'express';

// Models:
import Works from '../models/Works';

const internationalsController = {
    async list(req: Request, res: Response) {
        const { search, location, offset } = req.query;
        /*
            * Evita que um usuário apareça mais de uma vez na mesma pesquisa.
            * Faz o replace porque não tava dando para colocar o array dentro 
            * dos parênteses do IN.
            * Evita também um possível erro, pois o excluded da requisição,
            * obrigatoriamente, tem que ser um array com no mínimo uma string.
        */
        const excluded = (
            req.body.excluded &&
            Array.isArray(req.body.excluded) &&
            typeof req.body.excluded[0] === 'string'
        )
            ? req.body.excluded
            : [''];

        if (search === undefined) {
            return res.status(400).json({ message: 'empty query' })
        };

        /*
            * Pesquisa cada palavra individualmente.
        */
        function searchQuery() {
            //@ts-ignore
            let initial = search && search.split(' ')
            //@ts-ignore
            let words = []
            let searchQ = ''
            if (initial) {
                initial.map((it: any) => words.push(it))
                //@ts-ignore
                words = words
                    .filter((word) => word !== 'de')
                    .map((word) => `'%${word}%'`)
                    .join(', ');
                searchQ = ` AND (works.title ILIKE ANY(ARRAY[${words}]) 
                OR users.profession ILIKE ANY(ARRAY[${words}])) `
            }
            return searchQ;
        };

        /*
            * Se o city_id for undefined precisa trocar o sinal de = para != 0.
        */
        function locationQuery() {
            let locationQ = ' WHERE (int.country IS NOT NULL) '
            if (typeof location === 'string')
                locationQ = ` WHERE (int.country = '${location.toLowerCase().trim()}') `
            return locationQ;
        };

        //@ts-ignore
        await Works.sequelize.query(
            `
             SELECT *
            FROM (
                SELECT DISTINCT ON (works.user_uid)
                    works.id,
                    works.title,
                    works.discount,
                    works.banner,
                    works.price,
                    works.description,
                    works.user_uid,
                    users.uid,
                    users.name,
                    users.profession,
					int.country as int_country,
					int.state as int_state,
					int.city as int_city
                FROM works 
                INNER JOIN users ON (works.user_uid = users.uid)
				INNER JOIN internationals AS int ON (int.work_id = works.id)
                ${locationQuery()}
                ${searchQuery()}
                ORDER BY works.user_uid,
                        CASE WHEN works.price IS NULL THEN 1 ELSE 0 END, 
                        RANDOM() -- Ordenação aleatória para preços não nulos
            ) AS t
            ORDER BY
                CASE WHEN price IS NULL THEN 1 ELSE 0 END, 
                CASE WHEN price IS NOT NULL THEN RANDOM() END NULLS LAST 
            limit 21
            OFFSET ${offset || 0} * 21; 
            `,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    excluded: excluded
                }
            }
        )
            .then(list => {
                /*
                     * Retorna a lista normal
                     * e uma lista ( excluded ) com apenas os UIDs
                     * para evita que um usuário apareça mais de uma
                     * vez na mesma pesquisa.
                */
                const push = list.map((it: any) => it.uid);
                return res.status(200).json({
                    list,
                    excluded: excluded.concat(push)
                })
            })
            .catch(err => {
                error(err)
                return res
                    .status(500)
                    .json({ message: 'list internationals cards error' })
            });

    }
}

export default internationalsController;