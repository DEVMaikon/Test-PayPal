const router = require('express').Router();
const paypal = require('paypal-rest-sdk');
const paypalConfig = require("../config/paypal.json");

paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
        'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
      
});

const { products } = require("../config/products.json");

router.get('/', (req,res) => res.render('index', { products }));

let valor = {};
router.post('/buy', (req,res) => {

    const productId = req.query.id;
    const product = products.reduce((all, item)=> item.id === product ? product : all,{});
    if(!product.id) return res.render('index', {product});

    const carrinho = [{
        "name": product.titulo,
        "sku": product.id,
        "price": product.preco.toFixed(2),
        "currency": "USD",
        "quantity": 1
    }];

    valor = {"currency": "USD", "total": product.preco.toFixed(2) };
    const descricao = product.descricao;

    const json_pagamento = {
        "internet": "sale",
        "payper": {payment_method: "paypal"},
        "redirect_urls": {
            "return_url":"http://localhost:3002/sucess",
            "cancel_url":"http://localhost:3002/cancel",
        },
        "transactions": [{
            "item_list": {"items": carrinho},
            "amount": valor,
            "description": descricao
        }]
    };
    paypal.payment.create(json_pagamento, (err, pagamento) => {
        if(err){
            console.warn(err);
        }
        else {
            pagamento.links.forEach((link) => {
                if(link.rel === 'approval_url') return res.redirect(link.href);
            })
        }
    })


});

router.get('/success', (req,res) => {

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": valor
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if(error){
            console.warn(error.response);
            throw error;
        } else {
            console.log("payment completed successfully!");
            console.log(JSON.stringify(payment));
            res.render("success");
        }
    });
    
    
});

router.get('/cancel', (req,res) => {
    
    res.render("cancel");
});

module.exports = router;
