import { Request, Response } from "express";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const TEST = {
    async intent(req: Request, res: Response) {
        try {
            const { amount } = req.body;

            // Crie um Payment Intent com a Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, // Valor em centavos (R$ 19,90 = 1990 centavos)
                currency: 'BRL',
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            console.log('1', paymentIntent);

            res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            console.error('Erro ao criar Payment Intent:', error);
            res.status(500).json({ error: 'Erro ao processar o pagamento.' });
        }
    },
    async process(req: Request, res: Response) {

        const { paymentData } = req.body;

        console.log('2', paymentData);

        return res.status(200).end();
    }
}

export default TEST;