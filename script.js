document.addEventListener('DOMContentLoaded', function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart on page load
  console.log("Cart data from localStorage on load:", cart); // Debugging

  function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product');

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;

      productList.appendChild(productCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function () {
        const productId = parseInt(this.getAttribute('data-id'));
        console.log("Button clicked! Product ID:", productId);
        addToCart(productId);
      });
    });
  }

  function fetchProducts(category = 'All') {
    fetch('products.json')
      .then(response => response.json())
      .then(data => {
        if (category === 'All') {
          displayProducts(data);
        } else {
          displayProducts(data.filter(product => product.category === category));
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }

  function addToCart(productId) {
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        const product = products.find(item => item.id === productId);
        if (product) {
          console.log("Cart before adding item:", cart);
          
          cart = [...cart, product]; // Ensure cart updates
          localStorage.setItem("cart", JSON.stringify(cart));

          console.log("Cart after adding item:", cart);
          updateCartUI();
        }
      })
      .catch(error => console.error("Error adding product:", error));
  }

  function updateCartUI() {
    const cartList = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartList.innerHTML = ''; // Clear previous cart
    let total = 0;

    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `<p>${item.name} - ₹${item.price}</p>`;
      cartList.appendChild(cartItem);
      total += item.price;
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);

    console.log("Cart UI Updated:", cart);
  }

  document.getElementById('clearCartBtn').addEventListener('click', function () {
    cart = [];
    localStorage.removeItem("cart");
    updateCartUI();
  });

  fetchProducts();
  updateCartUI(); // Load UI after fetching cart

  window.addEventListener('load', function () {
    let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart data on page load:", savedCart);
    cart = savedCart;
    updateCartUI();
  });

  document.getElementById('checkoutBtn').addEventListener('click', function () {
    if (cart.length === 0) {
      alert("Your cart is empty!");
    } else {
      window.location.href = "checkout.html";
    }
  });
});
