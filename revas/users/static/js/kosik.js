let cart = [];

// Function to add an item to the cart
function addToCart(item, price) {
    cart.push({ item, price });
    updateCart();
}

// Function to update the cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';  // Clear previous items
    let totalPrice = 0;

    // Loop through the cart and display items
    cart.forEach(item => {
        const cartItem = document.createElement('p');
        cartItem.textContent = `${item.item} - $${item.price}`;
        cartItemsContainer.appendChild(cartItem);
        totalPrice += item.price;
    });

    // Update the total price
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = `Celková cena: $${totalPrice}`;
}

// Function to create a checkout session and redirect to Stripe Checkout
function checkout() {
    const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);

    fetch('/create-checkout-session/', {
        method: 'POST',
        body: JSON.stringify({ items: cart }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(session => {
        const stripe = Stripe('your-public-key-here'); // Zadejte svůj veřejný Stripe klíč
        stripe.redirectToCheckout({ sessionId: session.id });
    })
    .catch(error => console.error('Error:', error));
}