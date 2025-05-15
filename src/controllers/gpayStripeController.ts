import { Request, Response } from "express";
import Stripe from 'stripe';
import isJson from "../functions/isJson";
import { error } from "console";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const gpayStripeController = {
    async intent(req: Request, res: Response) {
        try {
            const { amount } = req.body;

            // Crie um Payment Intent com a Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, // Valor em centavos (R$ 19,90 = 1990 centavos)
                currency: 'BRL',
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never'
                },
            });

            console.log('1', paymentIntent);

            res.json(paymentIntent);
        } catch (error) {
            console.error('Erro ao criar Payment Intent:', error);
            res.status(500).json({ error: 'Erro ao processar o pagamento.' });
        }
    },

    async process(req: Request, res: Response) {

        const { paymentData } = req.body;

        console.log('2', paymentData);

        try {
            let paymentMethod;

            if (paymentData.paymentMethodData.type === 'CARD') {

                if (!isJson(paymentData.paymentMethodData.tokenizationData.token)) return error('NOT JSON');

                const cardDetails = JSON.parse(paymentData.paymentMethodData.tokenizationData.token);
                const token = cardDetails.id;

                console.log('TOKEN:', token, typeof token)

                paymentMethod = await stripe.paymentMethods.create({
                    type: 'card',
                    card: {
                        token,
                    },
                });

                console.log('paymentMethod: ', paymentMethod)
            } else {
                //  Lógica para outros tipos de pagamento (ex:  'PAYMENT_METHOD') se necessário
                return res.status(400).json({ error: 'Tipo de pagamento não suportado.' });
            }


            return res.status(200).json({ paymentMethodId: paymentMethod.id });

        } catch (error) {
            console.error('Erro ao processar o pagamento e criar PaymentMethod:', error);
            return res.status(500).json({ error: 'Erro ao processar o pagamento.' });
        }
    },

    async confirm(req: Request, res: Response) {
        const { paymentId, paymentMethodId } = req.body;

        const result = await stripe.paymentIntents.confirm(paymentId, { payment_method: paymentMethodId })
            .catch(err => console.error('Erro ao CONFIRMAR Payment Intent:', err))

        console.log('3', result);

        return res.status(200).json(result).end();

    }
}

export default gpayStripeController;