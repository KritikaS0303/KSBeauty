// Existing cart functionality code

// Initialize cart as an empty array or load from localStorage
// Load cart from localStorage and update UI on page load
let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Cart loaded from localStorage:', cart);


// This is your test value. You can remove it when you're done testing.

// This is to make sure we are getting the cart from localStorage correctly
console.log('Cart from localStorage (before add):', localStorage.getItem('cart'));

// Function to display products dynamically
function displayProducts(products) {
  const productList = document.getElementById('productList');
  productList.innerHTML = ''; // Clear existing products

  if (products.length === 0) {
    productList.innerHTML = '<p>No products available in this category.</p>';
    return;
  }

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product');

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    productList.appendChild(productCard);
  });
}

// Function to fetch all products
function fetchProducts(category = 'All') {
  fetch('products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    })
    .then(data => {
      if (category === 'All') {
        displayProducts(data);
      } else {
        const filteredProducts = data.filter(product => product.category === category);
        displayProducts(filteredProducts);
      }
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      document.getElementById('productList').innerHTML = '<p>Failed to load products. Please try again later.</p>';
    });
}

// Event listeners for category buttons
document.querySelectorAll('.categories button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    fetchProducts(category); // Fetch and display products for the selected category
  });
});

// Initial fetch (load all products)
fetchProducts();

// Add product to cart
function addToCart(productId) {
  fetch('products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      return response.json();
    })
    .then(data => {
      const product = data.find(item => item.id === productId);
      if (product) {
        const isAlreadyInCart = cart.some(item => item.id === productId);
        if (!isAlreadyInCart) {
          cart.push(product); // Add product to cart
          localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
          console.log('Cart updated:', cart); // Log updated cart
          console.log('Cart saved to localStorage:', localStorage.getItem('cart')); // Log cart from localStorage
        } else {
          alert('This item is already in your cart.');
        }
      }
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
      alert('Failed to add product to cart. Please try again later.');
    });
}


// Update cart display
function updateCart() {
  const cartSection = document.getElementById('cartSection');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');

  cartItems.innerHTML = ''; // Clear previous cart items
  let total = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <p>${item.name} - $${item.price}</p>
    `;
    cartItems.appendChild(cartItem);
    total += item.price; // Add item price to total
  });

  cartTotal.textContent = `Total: $${total}`;
  cartCount.textContent = `Items in Cart: ${cart.length}`;
  

  // Show/hide the cart section based on item count
  if (cart.length > 0) {
    cartSection.classList.add('show');
  } else {
    cartSection.classList.remove('show');
  }
}

// Toggle cart visibility
function toggleCart() {
  const cartSection = document.getElementById('cartSection');
  cartSection.classList.toggle('show');
}

// Clear the cart
function clearCart() {
  cart = []; // Empty the cart
  updateCart(); // Update the cart UI
  localStorage.setItem('cart', JSON.stringify(cart)); // Clear cart from localStorage
}

// Checkout (optional functionality)
// If cart is already declared earlier, do not redeclare it
// just use the existing variable `cart` below.

function checkout() {
  if (cart.length > 0) {
    localStorage.setItem('cart', JSON.stringify(cart));  // Save cart data to localStorage
    window.location.href = 'checkout.html';  // Redirect to checkout page
  } else {
    alert('Your cart is empty. Please add items to your cart before proceeding.');
  }
}

// Add event listener to checkout button
document.getElementById('checkoutBtn').addEventListener('click', checkout);


// Event listeners for cart section buttons
document.getElementById('cartIcon').addEventListener('click', toggleCart); // Toggle cart visibility
document.getElementById('clearCartBtn').addEventListener('click', clearCart); // Clear cart button
document.getElementById('checkoutBtn').addEventListener('click', checkout); // Checkout button

// Load cart from localStorage and update UI on page load
updateCart();
// Event listener for the "Go Back to Home" button


