document.addEventListener('DOMContentLoaded', function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage

  function displayProducts(products) {
      const productList = document.getElementById('productList');
      productList.innerHTML = ''; // Clear previous content

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
              addToCart(productId);
          });
      });
  }

  function fetchProducts(category = 'All') {
      fetch('products.json')
          .then(response => response.json())
          .then(data => {
              const filteredProducts = category === 'All' ? data : data.filter(product => product.category === category);
              displayProducts(filteredProducts);
          })
          .catch(error => console.error('Error fetching products:', error));
  }

  function addToCart(productId) {
      fetch('products.json')
          .then(response => response.json())
          .then(products => {
              const product = products.find(item => item.id === productId);
              if (product) {
                  cart.push(product);
                  localStorage.setItem("cart", JSON.stringify(cart));
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
  }

  document.getElementById('clearCartBtn').addEventListener('click', function () {
      cart = [];
      localStorage.removeItem("cart");
      updateCartUI();
  });

  document.getElementById('checkoutBtn').addEventListener('click', function () {
      if (cart.length === 0) {
          alert("Your cart is empty!");
      } else {
          window.location.href = "checkout.html";
      }
  });

  // Fix category buttons not working
  document.querySelectorAll('.categories button').forEach(button => {
      button.addEventListener('click', function () {
          const category = this.getAttribute('data-category');
          fetchProducts(category);
      });
  });

  fetchProducts(); // Load all products on initial page load
  updateCartUI(); // Update cart UI on page load
});
