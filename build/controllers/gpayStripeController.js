"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const gpayStripeController = {
    async intent(req, res) {
        try {
            const { amount } = req.body;
            // Crie um Payment Intent com a Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'BRL',
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never'
                },
            });
            console.log('1', paymentIntent);
            res.json(paymentIntent);
        }
        catch (error) {
            console.error('Erro ao criar Payment Intent:', error);
            res.status(500).json({ error: 'Erro ao processar o pagamento.' });
        }
    },
    async process(req, res) {
        const { paymentData } = req.body;
        console.log('2', paymentData);
        return res.status(200).end();
    },
    async confirm(req, res) {
        const { paymentId, paymentMethod } = req.body;
        const paymentMethod_ = 'pm_card_visa';
        const result = await stripe.paymentIntents.confirm(paymentId, { payment_method: paymentMethod_ })
            .catch(err => console.error('Erro ao CONFIRMAR Payment Intent:', err));
        console.log('3', result);
        return res.status(200).json(result).end();
    }
};
exports.default = gpayStripeController;
