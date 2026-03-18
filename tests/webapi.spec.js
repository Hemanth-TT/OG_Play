import {test, expect} from '@playwright/test';
import { request } from 'node:http';

// const {test, expect} = require("@playwright/test");


const base_url ="http://localhost:3000/api";

test('get call to fetch', async({request}) => {

    const response =await request.get(`${base_url}/orders`);
 
    console.log((await response.body()).toString());
    //200 => ok
    // expect(response.ok()).toBeTruthy();

    expect(response.status()).toBe(200);

    const responseArray = await response.json();

    expect (Array.isArray(responseArray)).toBeTruthy();

    expect(responseArray.length).toBeGreaterThan(0);
    expect (responseArray[0]).toEqual(
            expect.objectContaining
            ({
                orderNumber:expect.any(String),
                email:expect.any(String),
                items:expect.any(Array),
                total: expect.any(Number)

            }),

    );

    



});

test('Get call to fetch specific order using order #', async({request}) => {
 
    const orderNumber = 'ORD-1771830717387';
    const response = await request.get(`${base_url}/orders/${orderNumber}`);
 
    console.log((await response.body()).toString());
    //200 => OK
    expect(response.ok()).toBeTruthy();
 
    const responseArray = await response.json();
 
    expect(responseArray).toEqual(
        expect.objectContaining({
            orderNumber: expect.any(String),
            email: expect.any(String),
            total: expect.any(Number),
            items: expect.any(Array),
        }),
    );
});

test('Get call to fetch specific order using email id', async({request}) => {
 
    const emailAddress = 'jamie@example.com';
    const response = await request.get(`${base_url}/orders/${emailAddress}`);
 
    console.log((await response.body()).toString());
    //200 => OK
    expect(response.ok()).toBeTruthy();
 
    const responseArray = await response.json();
 
    // //if only one order comes back use below
    // expect(responseArray).toEqual(
    //     expect.objectContaining({
    //         orderNumber: expect.any(String),
    //         email: expect.any(String),
    //         total: expect.any(Number),
    //         items: expect.any(Array),
    //     }),
    // );
 
    //if more than one order comes back as response then use below:
    expect (Array.isArray(responseArray)).toBeTruthy();
 
    expect(responseArray.length).toBeGreaterThan(0);
 
    expect(responseArray[0]).toEqual(
        expect.objectContaining({
            orderNumber: expect.any(String),
            email: expect.any(String),
            total: expect.any(Number),
            items: expect.any(Array),
        }),
    );
});


test('post to create order', async({request})=>{


    const payload = {  
        
        "customerName": "Juicy",
        "email": "trust@gmail.com",
        "streetAddress": "Austion town, blr, ff21",
        "city": "banglore",
        "zipCode": "560001",
        "shippingMethod": "Standard (5-7 days) - Free",
        "paymentMethod": "Credit Card",
        "paymentDetails": {
            "cardEnding": "1111",
            "cardName": "juciy"
        },
        "items": [
            { "name": "4K Monitor", "sku": "4K-27", "price": 399.99,"quantity": 2},
            { "name": "Wireless Mouse", "sku": "WM-15", "price": 49.99,"quantity": 2},
        ],
        "subtotal": 899.96,
        "shipping": 0,
        "total": 899.96,
        "status": "Order Placed"
    };


    const response= await request.post(`${base_url}/orders`,
        {data: payload,

        });

        // expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);
        const body = await response.json();
        console.log((await response.body()).toString());

});

test.only('get all oder and parse the response', async({request})=>{

    const response =await request.get(`${base_url}/orders`);
 
    console.log((await response.body()).toString());
    //200 => ok
    // expect(response.ok()).toBeTruthy();

    expect(response.status()).toBe(200);
    const responseArray = await response.json();


    const firstOrder= responseArray[0].orderNumber;

    console.log('order nuber is: ', firstOrder);


    // const sasforder =responseArray.find((o: any) => o.customerName ==='sasf');
   
    const sforderr = responseArray.find(o =>
        o.customerName && o.customerName.toLowerCase().includes('sasf')
    );

    console.log('sasf',sforderr);
    expect(sforderr).toString();


    });