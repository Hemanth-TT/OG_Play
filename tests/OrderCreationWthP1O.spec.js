const { test, page } = require("@playwright/test");

import { CartPage } from '../../pageObject/CartPage';
import { CheckoutPage } from '../../pageObject/CheckoutPage';
import { ProductSelectionPage } from '../../pageObject/ProductSelectionPage';


test("Create oder with Page Object", async ({ page }) => {

    //UI Test    
    const productSelectionPage = new ProductSelectionPage(page);

    await productSelectionPage.launchWebApp("http://localhost:3000/");

    //Add Product To Cart
    const productName = "4K Monitor";
    await productSelectionPage.filterProduct(productName);
    await productSelectionPage.addProductToCart(productName);
    await productSelectionPage.gotoCart();

    //Cart Page Actions
    const cartPage = new CartPage(page);
    await cartPage.assertCartPage();
    await cartPage.assertProductInCart(productName);
    await cartPage.proceedToCheckout()

    //Checkout Page Actions
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.assertCheckoutPage();

    const fullName = "Danny" + Date.now();
    const email = fullName + "@test.com";
    const shippingMethod = "express"
    await checkoutPage.ShippingInformation(fullName, email, "20 GraceChruch Street", "London", "EC2M", shippingMethod);

    const paymentMethod = "PayPal (Test Mode)";
    await checkoutPage.choosePaymentMethod(paymentMethod);

    if (paymentMethod === "Credit Card") {
        await checkoutPage.completePaymentInfo("4111-1111-1111-1111", fullName, "12/26", "123");
    }


    await checkoutPage.placeOrder();


});