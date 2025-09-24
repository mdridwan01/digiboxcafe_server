const axios = require('axios');
const globals = require('node-global-storage');
const { v4: uuidv4 } = require('uuid');
const tokenStore = require("../middleware/utils/tokenStore");
const Payment = require('../models/Payments');
const dotenv = require('dotenv');
dotenv.config();
const APPLICATION_URL = process.env.APPLICATION_URL;
const SERVER_URL = process.env.SERVER_URL;

class bkashController {
    async createPayment(req, res) {
         // Clear one product token store
             
        const {amount, product_Id} = req.body;
            tokenStore.setToken('Product_Id', product_Id);
        try{
            const {data} = await axios.post("https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create", {
                mode: "0011",
                payerReference: "Digibox",
                callbackURL: `${SERVER_URL}/api/bkash/payment/callback`,
                amount: amount,
                currency: "BDT",
                intent: 'sale',
                merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
            }, {
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": "application/json",
                    "Authorization": tokenStore.getToken('id_token'),
                    'X-APP-Key': process.env.bkash_api_key
                }
            })
            return res.status(200).json({
                bkashURL: data.bkashURL     
            });


        }catch (error) {
            console.error('Error creating payment:', error.message);
            return res.status(500).json({ error: error.message });
        }
     }

    async call_back(req, res){
        const {paymentID, status} = req.query;
        console.log("I'm Callback ID:", tokenStore.getToken('Product_Id'), tokenStore.getToken('id_token'));
        if(status === "cancel" || status === "failure"){
           return res.redirect(`${APPLICATION_URL}/error?message=${status}`);
        }
        if(status === "success"){
            console.log("Payment ID:", paymentID);
            try {
                 
                const {data} = await axios.post(process.env.bkash_execute_payment_url, {
                    paymentID: paymentID
                }, {
                    headers: {
                        "Content-Type": 'application/json',
                        Accept: "application/json",
                        Authorization: tokenStore.getToken('id_token'),
                        'X-APP-Key': process.env.bkash_api_key
                    }
                });
                console.log("Payment execute data:", data);
                if(data && data.statusCode === "0000") {
                    await Payment.create({
                        product_id : tokenStore.getToken('Product_Id'),
                        paymentID,
                        transactionID : data.trxID,
                        date : data.paymentExecuteTime,
                        amount : data.amount,
                        currency: data.currency,
                        status: data.transactionStatus,
                    });
                   const ProductID = tokenStore.getToken('Product_Id');
                    const Products_IDS = String(ProductID); // ✅ Use String(), not toString()
                   console.log("hi", Products_IDS);

                // const response =  await axios.patch(`${SERVER_URL}/api/vending/68d3c79b0435cc57850b6474`,
                //         { box_1: "on", uiToken: false }, // Request body
                //         {
                //             headers: {
                //             'Content-Type': 'application/json'
                //             }
                //         }
                //         );
                //  const response = await axios.patch(`${SERVER_URL}/api/vending/68d3c79b0435cc57850b6474`,{  box_1: "on", uiToken: false }, // Request body
                //         {
                //             headers: {
                //             'Content-Type': 'application/json'
                //             }
                //         }
                //         );
                //         console.log("Vending response:", response.data);

                //     //  console.log("Product ID:", );
                //     // console.log(tokenStore.getToken('Product_Id'))
                //          return res.redirect(`${APPLICATION_URL}/success`)
                // }
                    try {
                            const response = await axios.patch(`${SERVER_URL}/api/vending/68d3c79b0435cc57850b6474`, {
                                box_1: "on",
                                uiToken: false
                            }, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            console.log("Vending response:", response.data);
                            return res.redirect(`${APPLICATION_URL}/success`);

                        } catch (patchError) {
                            console.error("Error updating vending machine:", patchError);
                            return res.redirect(`${APPLICATION_URL}/error?messageThree=${patchError.message}`);
                        }
                    }
                else {
                    console.log("Payment executed error:", data);
                    return res.redirect(`${APPLICATION_URL}/error?messageOne=${data.statusMessage}`);
                
               }
            }  catch (error) {
                console.error('Error executing payment:', error.message)
             return res.redirect(`${APPLICATION_URL}/error?messageTwo=${error.message}`)
            }
                  
        }
        console.log("Payment status:", status);
    }
}

module.exports = new bkashController();

// const axios = require('axios');
// const globals = require('node-global-storage');
// const { v4: uuidv4 } = require('uuid');
// const tokenStore = require("../middleware/utils/tokenStore");
// const Payment = require('../models/Payments');
// const dotenv = require('dotenv');
// dotenv.config();
// const APPLICATION_URL = process.env.APPLICATION_URL;
// const SERVER_URL = process.env.SERVER_URL;

// class bkashController {
//     async createPayment(req, res) {
//         const { amount, product_Id } = req.body;
//         tokenStore.setToken('Product_Id', product_Id);  // Store the product ID

//         try {
//             const { data } = await axios.post("https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create", {
//                 mode: "0011",
//                 payerReference: "Digibox",
//                 callbackURL: `http://192.168.68.118:5000/api/bkash/payment/callback`,
//                 amount: amount,
//                 currency: "BDT",
//                 intent: 'sale',
//                 merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
//             }, {
//                 headers: {
//                     "Content-Type": 'application/json',
//                     "Accept": "application/json",
//                     "Authorization": tokenStore.getToken('id_token'),
//                     'X-APP-Key': process.env.bkash_api_key
//                 }
//             });

//             return res.status(200).json({
//                 bkashURL: data.bkashURL  // Returning the payment URL
//             });

//         } catch (error) {
//             console.error('Error creating payment:', error);
//             return res.status(500).json({ error: error.response ? error.response.data : error.message });
//         }
//     }

//     async call_back(req, res) {
//         const { paymentID, status } = req.query;
//         console.log("Callback ID:", tokenStore.getToken('Product_Id'), tokenStore.getToken('id_token'));

//         if (status === "cancel" || status === "failure") {
//             return res.redirect(`${APPLICATION_URL}/error?message=${status}`);
//         }

//         if (status === "success") {
//             console.log("Payment ID:", paymentID);
//             try {
//                 const { data } = await axios.post(process.env.bkash_execute_payment_url, {
//                     paymentID: paymentID
//                 }, {
//                     headers: {
//                         "Content-Type": 'application/json',
//                         Accept: "application/json",
//                         Authorization: tokenStore.getToken('id_token'),
//                         'X-APP-Key': process.env.bkash_api_key
//                     }
//                 });

//                 console.log("Payment execute data:", data);

//                 if (data && data.statusCode === "0000") {
//                     await Payment.create({
//                         product_id: tokenStore.getToken('Product_Id'),
//                         paymentID,
//                         transactionID: data.trxID,
//                         date: data.paymentExecuteTime,
//                         amount: data.amount,
//                         currency: data.currency,
//                         status: data.transactionStatus,
//                     });

//                     const ProductID = tokenStore.getToken('Product_Id');
//                     const Products_IDS = String(ProductID);  // ✅ Use String(), not toString()
//                     console.log("Product ID:", Products_IDS);

//                     // Make a PATCH request to update vending
//                     try {
//                         const response = await axios.patch(`http://192.168.68.118:5000/api/vending/68d3c79b0435cc57850b6474`, {
//                             box_1: "on",
//                             uiToken: false
//                         }, {
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             }
//                         });

//                         console.log("Vending response:", response.data);
//                         return res.redirect(`${APPLICATION_URL}/success`);

//                     } catch (patchError) {
//                         console.error("Error updating vending machine:", patchError);
//                         return res.redirect(`${APPLICATION_URL}/error?messageThree=${patchError.message}`);
//                     }

//                 } else {
//                     console.log("Payment executed error:", data);
//                     return res.redirect(`${APPLICATION_URL}/error?messageOne=${data.statusMessage}`);
//                 }
//             } catch (error) {
//                 console.error('Error executing payment:', error.message);
//                 return res.redirect(`${APPLICATION_URL}/error?messageTwo=${error.message}`);
//             }
//         }
//         console.log("Payment status:", status);
//     }
// }

// module.exports = new bkashController();
