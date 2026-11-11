const menuItems = [
      { name: "Paneer Tikka", cat: "starter", price: 249, desc: "Smoky grilled paneer, mint chutney, onion rings.", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80" },
      { name: "Crispy Corn", cat: "starter", price: 179, desc: "Golden crispy corn tossed in spicy mayo.", img: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&auto=format&fit=crop&q=80" },
      { name: "Chicken Biryani", cat: "main", price: 299, desc: "Fragrant basmati, tender chicken, raita & salan.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80" },
      { name: "Butter Chicken", cat: "main", price: 329, desc: "Creamy tomato gravy, butter naan, kasuri methi.", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80" },
      { name: "Veg Fried Rice", cat: "main", price: 199, desc: "Wok tossed rice, veggies, manchurian sauce.", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80" },
      { name: "Choco Lava Cake", cat: "dessert", price: 149, desc: "Warm chocolate cake with molten center.", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80" },
      { name: "Gulab Jamun", cat: "dessert", price: 99, desc: "Soft khoya dumplings in saffron syrup.", img: "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?w=800&auto=format&fit=crop&q=80" },
      { name: "Mango Smoothie", cat: "drink", price: 129, desc: "Fresh alphonso mango, yogurt, honey.", img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80" },
      { name: "Cold Coffee", cat: "drink", price: 119, desc: "Iced coffee, vanilla scoop, chocolate drizzle.", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=80" },
    ];
    const grid = document.getElementById('menuGrid');
    function renderMenu(filter = 'all') {
      grid.innerHTML = '';
      menuItems.filter(i => filter === 'all' || i.cat === filter).forEach(item => {
        const d = document.createElement('div'); d.className = 'card';
        d.innerHTML = `<img src="${item.img}" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'" alt="${item.name}"><div class="card-body"><h3>${item.name}<b>₹${item.price}</b></h3><p>${item.desc}</p><button class="add-btn" onclick="addToOrder('${item.name}')">Add to Order +</button></div>`;
        grid.appendChild(d);
      });
    }
    renderMenu();
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active'); renderMenu(btn.dataset.cat);
      });
    });

    // ORDER SYSTEM
    let orders = JSON.parse(localStorage.getItem('spiceOrders')) || [];
    function addToOrder(name) {
      let item = menuItems.find(i => i.name === name);
      if (!item) return;
      orders.push(item);
      localStorage.setItem('spiceOrders', JSON.stringify(orders));
      updateOrdersUI();
      openOrders();
    }
    function updateOrdersUI() {
      document.getElementById('cartCount').innerText = orders.length;
      let list = document.getElementById('orderList');
      let total = 0;
      if (orders.length === 0) {
        list.innerHTML = `<div style="text-align:center;padding:40px 10px;color:#888"><div style="font-size:48px">🛒</div><p>No orders yet.<br>Tap <b>Add to Order</b> on any dish.</p></div>`;
      } else {
        list.innerHTML = orders.map((o, idx) => {
          total += o.price;
          return `<div class="order-item"><img src="${o.img}"><div style="flex:1"><h4>${o.name}</h4><p>₹${o.price}</p></div><button onclick="removeOrder(${idx})" style="border:none;background:#ffe0e0;width:30px;height:30px;border-radius:50%;cursor:pointer">🗑️</button></div>`;
        }).join('');
      }
      document.getElementById('orderTotal').innerText = '₹' + total;
    }
    function removeOrder(index) { orders.splice(index, 1); localStorage.setItem('spiceOrders', JSON.stringify(orders)); updateOrdersUI(); }
    function clearOrders() { orders = []; localStorage.removeItem('spiceOrders'); updateOrdersUI(); }
    function openOrders() { document.getElementById('orderDrawer').style.right = '0'; document.getElementById('orderOverlay').style.display = 'block'; }
    function closeOrders() { document.getElementById('orderDrawer').style.right = '-400px'; document.getElementById('orderOverlay').style.display = 'none'; }
    function checkoutOrder() {
      if (orders.length === 0) return alert('Your order is empty!');
      alert('✅ Order Placed! Total ₹' + orders.reduce((s, o) => s + o.price, 0) + '\nWe will deliver in 30 mins.');
      clearOrders(); closeOrders(); goReserve();
    }
    document.getElementById('ordersLink').addEventListener('click', (e) => {
      e.preventDefault(); updateOrdersUI(); openOrders();
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
    });
    document.getElementById('orderOverlay').addEventListener('click', closeOrders);
    updateOrdersUI();

    // NAVBAR MOBILE TOGGLE + SCROLL + PARALLAX
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => { navLinks.classList.toggle('open'); hamburger.classList.toggle('open'); });
    navLinks.querySelectorAll('a, button').forEach(el => el.addEventListener('click', () => {
      if (el.id !== 'ordersLink') { navLinks.classList.remove('open'); hamburger.classList.remove('open'); }
    }));
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
      const bg = document.getElementById('parallaxBg');
      if (window.scrollY < window.innerHeight) { bg.style.transform = `translateY(${window.scrollY * 0.35}px)`; }
    });

    // RESERVATION
    function goReserve() { document.getElementById('reserve').scrollIntoView({ behavior: 'smooth' }); }
    document.getElementById('rDate').min = new Date().toISOString().split('T')[0];
    document.getElementById('reserveForm').addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('rName').value;
      const date = document.getElementById('rDate').value;
      const time = document.getElementById('rTime').value;
      const guests = document.getElementById('rGuests').value;
      const box = document.getElementById('successBox');
      box.style.display = 'block'; box.innerHTML = `✅ Thank you ${name}! Table booked for ${guests} on ${date} at ${time}. See you soon!`;
      document.getElementById('bookingList').innerHTML += `<div>📅 ${name} • ${date} • ${time} • ${guests}</div>`;
      e.target.reset();
      setTimeout(() => box.style.display = 'none', 5000);
    });