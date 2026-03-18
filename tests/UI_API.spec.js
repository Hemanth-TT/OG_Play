const{test, expect} = require("@playwright/test");

const base_url ="http://localhost:3000/api";

test('post to create order and delete from UI', async({request, page})=>{

    //Api Test
    const payload = {  
        
        customerName: "Appium1",
        email: "Re@gmail.com",
        streetAddress: "Austion town, blr, ff21",
        city: "banglore",
        zipCode: "560001",
        shippingMethod: "Standard (5-7 days) - Free",
        paymentMethod: "Credit Card",
        paymentDetails: {
            cardEnding: "1111",
            cardName: "appi"
        },
        items: [
            { name: "4K Monitor", sku: "4K-27", price: 399.99,quantity: 2},
            { name: "Wireless Mouse", sku: "WM-15", price: 49.99,quantity: 2},
        ],
        subtotal: 899.96,
        shipping: 0,
        total: 899.96,
        status: "Order Placed",
    };

        const response = await request.post(`${base_url}/orders`, {data : payload});
        expect(response.status()).toBe(201);
        const result = await response.json();
        console.log(result);

   
        const orderNumber= result.orderNumber;


    // UI test
    await page.goto("http://localhost:3000/");
    console.log(await page.title());
    await expect(page).toHaveTitle("Product Catalog | QA Test Playground");
    await page.pause();

    const orderBtn = page.getByText('Orders', { exact: true });
    await orderBtn.click();

    const orderPageFrame = page.frameLocator("[title='Recent Orders']");

    const orderLocatorInOrderTable = orderPageFrame.locator("//td[text()='"+orderNumber+"']");
    await orderLocatorInOrderTable.waitFor();
    await expect(orderLocatorInOrderTable).toBeVisible();
    
    const viewOrderDetails = orderPageFrame.locator("//a[@href='/orders/"+orderNumber+"']");
    await viewOrderDetails.click();
    
    const cancelOrderBtn = page.getByRole('button',{name : "Cancel Order"});
    await cancelOrderBtn.waitFor();
    await cancelOrderBtn.click();
    await page.locator("[class='btn danger']").click();

    const ordercancellationmsg = page.locator("//div[text()='Order "+orderNumber+" cancelled.']");
    await ordercancellationmsg.waitFor();
    expect(await ordercancellationmsg.isVisible());

    const orderStatus =page.locator("[class='status-badge status-cancelled']");
    await orderStatus.waitFor();
    await expect(orderStatus).toHaveText("Cancelled");


    


});
