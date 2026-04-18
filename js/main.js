// ===== NAV SCROLL =====
window.addEventListener('scroll', () => {
  document.querySelector('nav')?.classList.toggle('scrolled', window.scrollY > 20);
});

document.addEventListener('DOMContentLoaded', () => {
  const ham = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (ham && links) ham.addEventListener('click', () => links.classList.toggle('open'));
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => { if (a.getAttribute('href') === path || a.getAttribute('href') === '../'+path) a.classList.add('active'); });
  initCookieBanner();
  initScrollReveal();
  updateCartBadge();
});

// ===== MODAL =====
function openModal(id) { const el = document.getElementById(id||'contact-modal'); if(el) el.classList.add('active'); document.body.style.overflow='hidden'; }
function closeModal(id) { const el = document.getElementById(id||'contact-modal'); if(el) el.classList.remove('active'); document.body.style.overflow=''; }
document.addEventListener('click', e => { if(e.target.classList.contains('modal-overlay')) { e.target.classList.remove('active'); document.body.style.overflow=''; } });

// ===== FORM SUBMIT =====
function handleFormSubmit(formId, successId) {
  const form = document.getElementById(formId);
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const consent = form.querySelector('input[name="consent"]');
    if(consent && !consent.checked) { alert('Please accept the privacy policy to continue.'); return; }
    form.style.display='none';
    const s = document.getElementById(successId); if(s) s.style.display='block';
  });
}

// ===== COOKIE =====
function initCookieBanner() {
  if(localStorage.getItem('ss_cookie')) return;
  setTimeout(() => document.getElementById('cookie-banner')?.classList.add('show'), 1500);
}
function acceptCookies() { localStorage.setItem('ss_cookie','yes'); document.getElementById('cookie-banner')?.classList.remove('show'); }
function declineCookies() { localStorage.setItem('ss_cookie','no'); document.getElementById('cookie-banner')?.classList.remove('show'); }

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('revealed'); obs.unobserve(e.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ===== CART ENGINE =====
const CART_KEY = 'ss_cart';
function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY))||[]; } catch { return []; } }
function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); }
function addToCart(productId, size, qty=1) {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if(!product) return;
  const existing = cart.find(i => i.id === productId && i.size === size);
  if(existing) existing.qty += qty;
  else cart.push({ id: productId, name: product.name, brand: product.brand, price: product.price, image: product.images[0], size, qty });
  saveCart(cart);
  showCartToast(product.name);
}
function removeFromCart(productId, size) { saveCart(getCart().filter(i => !(i.id===productId && i.size===size))); }
function updateCartQty(productId, size, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id===productId && i.size===size);
  if(item) { if(qty < 1) removeFromCart(productId, size); else { item.qty = qty; saveCart(cart); } }
}
function cartTotal() { return getCart().reduce((t,i) => t + i.price*i.qty, 0); }
function updateCartBadge() {
  const count = getCart().reduce((t,i) => t+i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => { b.textContent = count; b.style.display = count>0?'inline':'none'; });
}
function showCartToast(name) {
  const t = document.getElementById('cart-toast');
  if(!t) return;
  t.textContent = `✓ ${name} added to cart!`;
  t.style.display='block'; t.style.animation='none';
  setTimeout(()=>{ t.style.animation='slideDown 0.3s ease'; }, 10);
  setTimeout(()=>{ t.style.display='none'; }, 3000);
}

// ===== BLOG ENGINE =====
const BLOG_KEY = 'ss_blogs';
function getBlogs() { try { return JSON.parse(localStorage.getItem(BLOG_KEY))||[]; } catch { return []; } }
function saveBlogs(b) { localStorage.setItem(BLOG_KEY, JSON.stringify(b)); }
function addBlog(blog) {
  const blogs = getBlogs();
  blog.id = Date.now();
  blog.date = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  blogs.unshift(blog); saveBlogs(blogs); return blog;
}
function deleteBlog(id) { saveBlogs(getBlogs().filter(b => b.id!==id)); }

// ===== PRODUCTS DATA =====
const PRODUCTS = [
  { id:1, name:'AirStride Pro X1', brand:'Nike', price:129.99, oldPrice:159.99, colors:['#fff','#000','#FF2D00'], category:'running', badge:'sale', description:'Engineered for speed and comfort. The AirStride Pro X1 features a responsive foam midsole, breathable mesh upper, and dynamic traction outsole. Perfect for daily training runs and race days alike.', sizes:[7,7.5,8,8.5,9,9.5,10,10.5,11,12], images:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'] },
  { id:2, name:'CloudWalk Ultra', brand:'Adidas', price:149.99, oldPrice:null, colors:['#fff','#aaa','#0047FF'], category:'lifestyle', badge:'new', description:'Step into cloud-like comfort with the CloudWalk Ultra. Features a triple-density foam stack and premium knit upper that adapts to your foot. All-day wearability meets street-ready style.', sizes:[6,6.5,7,7.5,8,8.5,9,9.5,10,11], images:['https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80'] },
  { id:3, name:'Vertex Street Low', brand:'New Balance', price:99.99, oldPrice:120.00, colors:['#888','#fff','#FFE500'], category:'casual', badge:'sale', description:'The Vertex Street Low blends retro basketball aesthetics with modern cushioning technology. Vulcanized rubber outsole, suede overlays, and a cushioned insole make this an everyday essential.', sizes:[7,7.5,8,8.5,9,9.5,10,11,12,13], images:['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'] },
  { id:4, name:'TrailBlaze GTX', brand:'Salomon', price:189.99, oldPrice:null, colors:['#FF7300','#000','#444'], category:'trail', badge:'new', description:'Built for serious trail runners. The TrailBlaze GTX features GORE-TEX waterproofing, a protective toe cap, and aggressive multidirectional lugs. Conquer wet, rocky, and muddy terrain with confidence.', sizes:[7,7.5,8,8.5,9,9.5,10,10.5,11], images:['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'] },
  { id:5, name:'Classic Leather OG', brand:'Reebok', price:89.99, oldPrice:110.00, colors:['#fff','#f5f5dc','#000'], category:'lifestyle', badge:'sale', description:'A true icon reborn. The Classic Leather OG stays true to its roots with a full-grain leather upper, EVA midsole, and the iconic side stripe. Heritage style that never goes out of fashion.', sizes:[6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11], images:['https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'] },
  { id:6, name:'Velocity Racer TF', brand:'Puma', price:115.00, oldPrice:135.00, colors:['#FF0099','#000','#fff'], category:'running', badge:'sale', description:'Designed for speed-focused runners who demand lightweight performance. The Velocity Racer TF features a nitrogen-infused midsole, seamless mesh upper, and a carbon-composite plate for explosive propulsion.', sizes:[7,7.5,8,8.5,9,9.5,10,10.5,11,12], images:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80'] },
  { id:7, name:'Chuck Taylor High', brand:'Converse', price:70.00, oldPrice:null, colors:['#000','#fff','#FF2D00'], category:'casual', badge:'new', description:'The shoe that started it all. Reinvented for today with enhanced cushioning and updated materials, but still rocking the same iconic silhouette that\'s been cool for 100+ years.', sizes:[5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,11,12], images:['https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'] },
  { id:8, name:'ZeroG Boost Elite', brand:'Under Armour', price:160.00, oldPrice:200.00, colors:['#0047FF','#fff','#AAFF00'], category:'running', badge:'sale', description:'The ZeroG Boost Elite pushes the limits of what\'s possible in a running shoe. Ultra-lightweight UA HOVR foam, adaptive knit upper, and a propulsion plate that gives back energy with every stride.', sizes:[7,7.5,8,8.5,9,9.5,10,10.5,11,12,13], images:['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=600&q=80'] },
  { id:9, name:'Slip-On Woven Pro', brand:'Vans', price:65.00, oldPrice:null, colors:['#000','#888','#FF7300'], category:'casual', badge:null, description:'The ultimate in easy style. The Slip-On Woven Pro features a premium woven canvas upper, cushioned footbed, and signature waffle outsole. Slip them on and go — no laces, no hassle, all style.', sizes:[5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,12], images:['https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'] },
  { id:10, name:'ForceCourt Tennis', brand:'Wilson', price:135.00, oldPrice:155.00, colors:['#fff','#AAFF00','#FF2D00'], category:'sport', badge:'sale', description:'Engineered for clay and hard courts. The ForceCourt Tennis features a reinforced toe cap, herringbone outsole, and responsive cushioning system that keeps you moving fast and landing soft.', sizes:[7,7.5,8,8.5,9,9.5,10,10.5,11], images:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80'] },
  { id:11, name:'SkyHigh Basketball', brand:'Jordan', price:175.00, oldPrice:200.00, colors:['#FF2D00','#000','#fff'], category:'sport', badge:'sale', description:'Dominate the hardwood with the SkyHigh Basketball. Features a high-top silhouette for ankle support, responsive Zoom Air cushioning, and a herringbone traction pattern for cutting and pivoting.', sizes:[7,7.5,8,8.5,9,9.5,10,10.5,11,12,13], images:['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80','https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=600&q=80'] },
  { id:12, name:'Heritage Wallabee', brand:'Clarks', price:120.00, oldPrice:null, colors:['#8B6914','#000','#888'], category:'lifestyle', badge:'new', description:'A British classic that belongs on every shoe shelf. The Heritage Wallabee features a genuine suede upper, crepe sole, and moccasin construction that gets more comfortable with every wear.', sizes:[6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11], images:['https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=600&q=80','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80','https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&q=80'] }
];

function buildProductCard(p, dir='') {
  const badgeHTML = p.badge ? `<span class="product-badge ${p.badge}">${p.badge.toUpperCase()}</span>` : '';
  const oldPriceHTML = p.oldPrice ? `<span class="price-old">$${p.oldPrice.toFixed(2)}</span><span class="price-save">SAVE $${(p.oldPrice-p.price).toFixed(2)}</span>` : '';
  const dots = p.colors.map(c=>`<div class="color-dot" style="background:${c}"></div>`).join('');
  return `<div class="product-card reveal" onclick="window.location='${dir}product.html?id=${p.id}'">
    <div class="product-card-img"><img src="${p.images[0]}" alt="${p.name}" loading="lazy">${badgeHTML}</div>
    <div class="product-card-body">
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price"><span class="price-main">$${p.price.toFixed(2)}</span>${oldPriceHTML}</div>
      <div class="color-dots">${dots}</div>
      <button class="btn btn-black btn-sm btn-full" onclick="event.stopPropagation();addToCart(${p.id},${p.sizes[Math.floor(p.sizes.length/2)]});return false;">ADD TO CART →</button>
    </div>
  </div>`;
}

// Static blog posts (3 built-in)
const STATIC_BLOGS = [
  { id:'s1', title:'How to Choose the Right Running Shoe for Your Gait', category:'Buying Guide', date:'March 15, 2025', author:'SoleStore Editors', excerpt:'Finding the perfect running shoe isn\'t just about looks — it\'s about understanding your foot mechanics. We break down the key factors.', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=75', content:`<p>Choosing the right running shoe starts with understanding your gait. Overpronation, underpronation (supination), and neutral gait all require different levels of support and cushioning.</p><h2>Understand Your Foot Type</h2><p>The wet test is one of the easiest ways to determine your arch type. Wet the bottom of your foot and step on a piece of paper or cardboard. A flat footprint indicates low arches (often overpronation), a visible curve means normal arches, and a very thin connection indicates high arches (supination).</p><h2>Key Factors to Consider</h2><p><strong>Cushioning Level:</strong> Maximum cushioning works well for long distances and high-impact runners. Minimal cushioning suits those with strong mechanics who want a more natural feel.</p><p><strong>Drop Height:</strong> The heel-to-toe drop affects how your foot strikes the ground. Higher drops (8-12mm) are forgiving for heel strikers; low drops (0-4mm) encourage midfoot striking.</p><p><strong>Width:</strong> Never compromise on width. Your foot should be able to splay naturally inside the shoe without feeling pinched.</p><h2>Get Properly Fitted</h2><p>Always try shoes on in the afternoon when your feet are at their largest. Walk and run in the store, and always wear the socks you typically run in. Your thumb's width should fit between your longest toe and the end of the shoe.</p><p>Remember: the best running shoe is the one that fits YOUR foot, supports YOUR gait, and matches YOUR running goals. Don't buy based on what works for others.</p>` },
  { id:'s2', title:'Top 5 Sneaker Cleaning Hacks That Actually Work', category:'Care & Maintenance', date:'February 28, 2025', author:'SoleStore Editors', excerpt:'Keep your kicks fresh with these proven cleaning methods. From white soles to mesh uppers — we\'ve got every material covered.', image:'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=75', content:`<p>Your sneakers deserve better than a quick wipe with a damp cloth. Here are five cleaning methods that actually restore your shoes to near-original condition.</p><h2>1. The Magic Eraser for White Soles</h2><p>A slightly damp melamine foam eraser (Magic Eraser) is unbeatable for cleaning rubber soles and midsoles. Use gentle circular motions and the yellowing and scuffs will lift right off. Works on most rubber and foam materials.</p><h2>2. Baking Soda Paste for Canvas and Fabric</h2><p>Mix 1 tablespoon of baking soda with 1/2 tablespoon each of hydrogen peroxide and warm water. Apply to canvas or fabric uppers with an old toothbrush, let sit 20 minutes, then rinse. Your white canvas will look brand new.</p><h2>3. The Freezer Method for Gum</h2><p>If gum is stuck to your sole, place the shoe in a ziplock bag and freeze it overnight. The gum will harden and snap right off with a butter knife. Simple and effective.</p><h2>4. Leather and Suede TLC</h2><p>For leather shoes, use a leather conditioner after cleaning to prevent cracking. For suede, use a dedicated suede brush when dry — never use water on suede as it causes staining. For wet stains, let dry completely, then brush.</p><h2>5. Odor Elimination</h2><p>Sprinkle baking soda inside your shoes and let sit overnight. Shake out in the morning. For serious odor, place tea bags inside — they absorb moisture and deodorize naturally. Cedar shoe trees also work wonders for maintaining shape and reducing odor.</p><p>Regular cleaning not only keeps your sneakers looking great but also extends their lifespan significantly. Establish a routine and your collection will thank you.</p>` },
  { id:'s3', title:'2025 Sneaker Trends: What\'s Hot Right Now', category:'Trend Report', date:'January 20, 2025', author:'SoleStore Editors', excerpt:'From maximalist chunky soles to retro runners making a comeback — here\'s what\'s dominating the sneaker scene in 2025.', image:'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=800&q=75', content:`<p>The sneaker world never stands still. 2025 has brought a fascinating mix of nostalgia, technology, and sustainability into the spotlight. Here's what's dominating the scene.</p><h2>The Return of Retro Runners</h2><p>80s and 90s running silhouettes are absolutely everywhere. Think nylon uppers, visible cushioning systems, and earthy colour palettes. New Balance 990 and 1906R variants continue to dominate, alongside Asics Gel-Kayano 14 re-releases. This trend shows no sign of slowing.</p><h2>Maximalist Platforms Are Still Going Strong</h2><p>Chunky soles with extreme stack heights remain popular. Brands are experimenting with multi-layer foam constructions and exaggerated proportions that blur the line between athletic and fashion footwear. The Buffalo London and HOKA crossover aesthetic has become a legitimate movement.</p><h2>Sustainable Materials Taking Center Stage</h2><p>Consumers are demanding — and brands are delivering — more eco-conscious options. Recycled ocean plastics, bio-based foams, and natural rubber alternatives are increasingly common in mainstream collections. Allbirds, Veja, and even Nike's Space Hippie line have proven this isn't just a niche market.</p><h2>Monochromatic Looks</h2><p>The tonal dressing trend extends to footwear. All-white, all-black, and all-beige colorways have never been more popular. The cleaner the look, the better. Statement sneakers in a single color make an impact without competing with the rest of an outfit.</p><h2>Performance-Meets-Lifestyle Hybrids</h2><p>The line between gym shoes and street shoes continues to dissolve. Carbon-plated shoes designed for racing are being styled with everyday outfits. Customers want shoes that transition from workout to brunch without changing.</p>` }
];

function getAllBlogs() { return [...STATIC_BLOGS, ...getBlogs()]; }
