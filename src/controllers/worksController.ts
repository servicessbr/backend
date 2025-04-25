
import { Op, QueryTypes } from 'sequelize';
import { error } from 'console';
import { Request, Response } from 'express';

/* 
    * Models:
*/
import Works from '../models/Works';
import Subworks from '../models/Subworks';
import stringContainsOnlyDigits from '../functions/onlyDigits/stringContainsOnlyDigits';
import Internationals from '../models/Internationals';

const insertableSubworks = (subworks: any, work_id: any) => {
    /*
        * Acrescenta o ID do anúncio( work ) como foreign key
        * Se tiver, remove o capo ID para não ter conflito com o 
        * ID gerado automaticamente.
    */
    if (Array.isArray(subworks))
        return subworks.map(it => {
            delete it.id;
            return { ...it, work_id };
        })
    else return [];
}

const worksController = {
    async create(req: Request, res: Response) {
        //@ts-ignore
        const uid = req.uid;
        //@ts-ignore
        const pro = req.pro;

        if (!pro)
            return res
                .status(403)
                .json({ message: 'work create - user is not PRO' })
                .end();

        const {
            title, description,
            price, city_id,

            subworks,

            internationals
        } = req.body;

        const isInternationalRequest = (
            internationals &&
            typeof internationals.country === 'string' &&
            internationals.country.length === 2
        );

        console.log('isInternationalRequest',isInternationalRequest);

        if (!(
            city_id || isInternationalRequest
        )) return res
            .status(500)
            .json({ message: 'Por favor escolha uma cidade e estado' });

        if (!title) return res
            .status(500)
            .json({ message: 'Por favor defina o nome do serviço' });

        if (!price) return res
            .status(500)
            .json({ message: 'Por favor defina o preço do serviço' });

        if (!(stringContainsOnlyDigits(price))) return res
            .status(500)
            .json({ message: 'O preço deve ter apenas números' });

        //@ts-ignore
        const work: any = await Works.create({
            user_uid: uid,
            title, 
            description, 
            city_id: isInternationalRequest ? 0 : city_id,
            price: parseInt(price),
        }).catch(err => {
            error(err);
            return res
                .status(500)
                .json({ message: 'create work error' })
        });

        /*
            * Se tiver uma lista de subworks cria a tabela subworks:
        */
        if (Array.isArray(subworks)) {
            const insertSubWorks = insertableSubworks(subworks, work.id);
            //@ts-ignore
            await Subworks.bulkCreate(insertSubWorks)
                .catch((err: Error) => error(err))
        }

        console.log(internationals);
        /*
            * Se for internacional cria a table internacional:
        */
        if (isInternationalRequest) {
            //@ts-ignore
            await Internationals.create({
                work_id: work.id,
                country: internationals.country.toLowerCase(),
                state: internationals.state,
                city: internationals.city,

            })
                .catch((err: Error) => error(err))
        }

        return res.status(200).json({ work_id: work.id });
    },

    async update(req: Request, res: Response) {
        /*
            * Confere se tem algum dado para ser alterado
            * ou ta vazia.
        */
        if (!Object.keys(req.body).length)
            return res
                .status(204)
                .end()

        const { work_id } = req.body;

        const { work, subworks } = req.body;

        (work && Object.keys(work).length) &&
            //@ts-ignore
            await Works.update(
                work,
                {
                    status: ['title', 'description', 'price'],
                    where: { id: work_id }
                }
            )
                .catch(err => error(err));

        (subworks && Array.isArray(subworks)) &&
            //@ts-ignore
            Subworks.destroy({
                where: { work_id }
            })
                .then(async () => {
                    const insertSubWorks = insertableSubworks(subworks, work_id);
                    //@ts-ignore
                    await Subworks.bulkCreate(insertSubWorks)
                        .catch(err => error(err));
                })
                .catch(err => error(err));

        return res.status(200).end();
    },

    async load(req: Request, res: Response) {
        const { work_id } = req.params;

        if (!(stringContainsOnlyDigits(work_id)))
            return res
                .status(500)
                .json({ message: 'error - work_id is not a number' })

        //@ts-ignore
        const works = await Works.sequelize.query(
            `SELECT 
            works.id, works.title, works.description, 
            works.price, works.city_id, works.user_uid,
            users.name as user_name, users.profession as user_profession, 
            users.description as user_description, 
            cities.name as city, states.name as state
            FROM works 
            INNER JOIN users 
            ON (works.user_uid = users.uid) 
            INNER JOIN cities 
            ON (works.city_id = cities.id) 
            INNER JOIN states 
            ON (cities.state_id = states.id) 
            WHERE (works.id = :work_id) 
            LIMIT 1;`,
            {
                replacements: { work_id },
                type: QueryTypes.SELECT
            }
        ).catch(err => error(err))

        if (!works)
            return res
                .status(200)
                .json({ message: 'load works error' })

        //@ts-ignore
        const subworks = await Subworks.findAll({
            attributes: ['id', 'title', 'description', 'price'],
            where: { work_id }
        }).catch(err => error(err))

        if (!Array.isArray(subworks))
            return res
                .status(200)
                .json({ message: 'load subworks error' })

        return res
            .status(200)
            .json({
                work: works[0],
                subworks
            })
    },

    async delete(req: Request, res: Response) {
        //@ts-ignore
        const user_uid = req.uid;
        const { work_id } = req.params;

        //@ts-ignore
        await Works.destroy(
            {
                where: {
                    [Op.and]: [
                        { id: work_id },
                        { user_uid }
                    ]
                }
            }
        )
            .then(() => res
                .status(200)
                .json({ log: 'success' })
            )
            .catch((err) => {
                error(err);
                return res
                    .status(500)
                    .json({ message: 'destroy work error' })
            });
    }
}

export default worksController;
