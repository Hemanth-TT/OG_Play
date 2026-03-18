const{test,expect} = require("@playwright/test");



    test.only('add dynamic items1', async ({ page }) => {

    await page.goto("http://localhost:3000/");

    await expect(page).toHaveTitle("Product Catalog | QA Test Playground");


     const productsToAdd = [
        "Gaming Computer",
        "HD Webcam",
        "4K Monitor",
        "Desk Lamp", 
        "Portable SSD",
        "Wireless Mouse",
        "Standing Desk"
    ];
    let lastAddedProduct  = [];
    for (const productName of productsToAdd){
    const addtocartButton = page.locator("article").filter({ hasText: productName }).getByRole("button", { name: "Add to Cart" });
    

    if (await addtocartButton.isEnabled())
    {
            await addtocartButton.click();
            console.log(productName+' added to cart');
            lastAddedProduct.push(productName);
            await expect(page.getByText(`${productName} has been added to your cart.`)).toBeVisible();
            
    }else
    {
            console.log(productName+' is out of stock, cannot add to cart');
             
    }  
   
}
       
        //go to cart action
        const cartBtn= page.locator("a[class='cart-link']")
        await cartBtn.click();

        const productInCart = page.locator("section.card.cart-items");

     for (const product of lastAddedProduct) {
        await expect(productInCart).toContainText(product);
    }
      

        //Checkout
        const checkoutBtn= page.locator("a[class = 'btn primary block']");
        await checkoutBtn.click();
        console.log("All added products:", lastAddedProduct);


        const checkoutPage = page.getByRole('heading', { name: 'Checkout' });
        const actual = await checkoutPage.textContent();
        console.log( actual, "page displayed",)
        await expect(checkoutPage).toHaveText("Checkout");

        const placeorder =page.getByText('Place Order');    
        // const error= page.getByRole('alert');
        // await placeorder.click();
        // const actualerror  = await error.textContent();
        // console.log(actualerror, "failed to placeoder");




        const carttotal= page.locator("//strong[1]//span[1]");
        const custname ="Roocky";

        const name =page.locator('[name="customerName"]');
        const email =page.getByLabel('Email');
        const address = page.getByLabel('Street Address');
        const city = page.getByLabel('City');
        const zipcode= page.getByLabel('ZIP Code');
        await name.fill(custname);
        await email.fill("roocky@gmail.com");
        await address.fill("Austion town, blr, ff21")
        await city.fill("banglore");
        await zipcode.fill("560001")

        const shippingmethod =page.locator('select[name="shippingMethod"]');
        // page.locator(':text-is("Standard (5-7 days) - Free")')
        // page.locator(':text-is("Express (2-3 days) - £25.00")')
        //  page.locator(':text-is("Overnight (1 day) - £45.00")')



        //payment info
    
        const test=page.locator('div.info-box:visible');
        console.log("Test data",await test.textContent());

        const crdnum= page.getByLabel('Card Number')
        const nameOnCrd =page.getByLabel('Name on Card');
        const expdate= page.getByLabel('Expiry Date');
        const cvv= page.getByLabel('CVV');
        
        await crdnum.fill("4111-1111-1111-1111");
        await nameOnCrd.fill(custname);
        await expdate.fill("05/28");
        await cvv.fill("123");

         //placeoder final
          await placeorder.click();

        const rcntOdr= page.getByRole('heading', { name: 'Recent Orders' });
        console.log(await rcntOdr.textContent())
        await expect (rcntOdr).toContainText("Recent Orders");

       
});