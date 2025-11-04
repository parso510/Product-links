// script.js
// Handles UI and search by number

const products = typeof PRODUCTS !== "undefined" ? PRODUCTS : [];
const buttonsGrid = document.getElementById("buttonsGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const productCard = document.getElementById("productCard");
const emptyState = document.getElementById("emptyState");

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");
const productDesc = document.getElementById("productDesc");
const buyBtn = document.getElementById("buyBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");

// build buttons 1..10 (or based on products array)
function buildButtons() {
  const count = Math.max(10, products.length || 10);
  for (let i = 1; i <= count; i++) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.innerText = i;
    btn.addEventListener("click", () => showProductById(i));
    buttonsGrid.appendChild(btn);
  }
}

// find product
function findProduct(id) {
  return products.find(p => Number(p.id) === Number(id));
}

// show product
function showProduct(product) {
  if (!product) {
    productCard.classList.add("hidden");
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  productCard.classList.remove("hidden");

  productImage.src = product.image || "https://via.placeholder.com/600x600?text=No+Image";
  productImage.alt = product.name || "Product image";
  productName.textContent = product.name || `Product ${product.id}`;
  productPrice.textContent = product.price && product.price !== "—" ? `Price: ${product.price}` : "Price: —";
  productDesc.textContent = product.description || "";
  productStock.textContent = product.outOfStock ? "Availability: Out of stock" : "Availability: In stock";

  if (product.affiliateLink && product.affiliateLink.trim() !== "") {
    buyBtn.href = product.affiliateLink;
    buyBtn.classList.add("primary");
    buyBtn.removeAttribute("aria-disabled");
    buyBtn.textContent = "Buy Now";
  } else {
    buyBtn.removeAttribute("href");
    buyBtn.classList.remove("primary");
    buyBtn.setAttribute("aria-disabled", "true");
    buyBtn.textContent = "No link set";
    // make it non-clickable
    buyBtn.addEventListener("click", (e) => e.preventDefault(), { once: true });
  }

  // copy link button
  copyLinkBtn.onclick = async () => {
    const text = product.affiliateLink || "";
    if (!text) {
      alert("No affiliate link set for this product. Edit products.js to add it.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      copyLinkBtn.textContent = "Copied!";
      setTimeout(()=>copyLinkBtn.textContent = "Copy Link", 1500);
    } catch (err) {
      alert("Copy failed (browser may block clipboard). Link: " + text);
    }
  };

  // track clicks (local only)
  buyBtn.onclick = () => {
    try {
      const key = `clicks_p${product.id}`;
      const n = Number(localStorage.getItem(key) || 0) + 1;
      localStorage.setItem(key, n);
    } catch(e){}
  }
}

function showProductById(id) {
  const p = findProduct(id);
  showProduct(p);
  // accessibility: move focus to product card
  productCard.scrollIntoView({behavior:"smooth", block:"center"});
}

// search handler
searchBtn.addEventListener("click", () => {
  const val = searchInput.value.trim();
  if (!val) return;
  const num = Number(val);
  if (Number.isNaN(num)) {
    alert("Please enter a number (example: 1)");
    return;
  }
  showProductById(num);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

// initialize
buildButtons();
