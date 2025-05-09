import express, { Request, Response } from 'express';
import Stripe from 'stripe'; // npm install stripe
import { PRICE } from '../configs/constants/priceTags';
import { makePro } from './paymentsControllers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const GPayStripeController = {
    async StripeProcess(req: Request, res: Response) {
        const { paymentData } = req.body;

        const source = paymentData?.paymentMethodData?.tokenizationData?.token;

        if (!source) return res.status(500).end();

        console.log('_________paymentData_________', paymentData);
        console.log('_________PRICE*100_________', PRICE * 100);

        //@ts-ignore
        const uid = req.uid;
        //@ts-ignore
        const email = req.email;
        //@ts-ignore
        const name = req.name;

        try {
            // 1. Verify the paymentData (important security step - depends on your payment processor)
            //    (Stripe might have its own verification methods)

            // 2. Charge the user using Stripe
            const charge = await stripe.charges.create({
                amount: PRICE * 100, // Valor em centavos (ex: 1000 para R$ 10.00)
                currency: 'brl',
                source, // Use o token recebido do frontend
                description: 'Pagamento via Google Pay',
            });

            console.log('_________charge_________', charge);

            // 3. If the charge is successful, proceed with your application logic
            if (charge.status === 'succeeded') {
                await makePro(
                    res,
                    uid,
                    {
                        id: charge.id,
                        date_approved: new Date(),
                        amount: PRICE,
                        email: email,
                        name: name,
                    }
                );
                res.json({ success: true, message: 'Payment successful' });
            } else {
                res.status(400).json({ success: false, message: 'Payment failed' });
            }
        } catch (error: any) {
            console.error('Error processing Google Pay payment:', error);
            res.status(500).json({ success: false, message: 'Error processing payment', error: error.message });
        }
    }

}

export default GPayStripeController;