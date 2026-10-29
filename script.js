
const TUMIA_SUPABASE_URL = "https://kfsrvvovqxordkylovdk.supabase.co";
const TUMIA_SUPABASE_KEY = "sb_publishable_hFxg7TCNf7araEvG8WQudg_WOaxzQ1i";

const tumiaSupabase = window.supabase.createClient(
  TUMIA_SUPABASE_URL,
  TUMIA_SUPABASE_KEY
);

console.log("TUMIA Supabase client initialized");

const listings = [
  {
    id: 1,
    type: "professional",
    category: "professional",
    title: "John the Electrician",
    description: "Electrical repairs, lighting and home installations.",
    price: 800,
    priceLabel: "From KSh 800",
    location: "Bungoma",
    icon: "⚡",
    cover: "cover-blue",
    tag: "Electrical"
  },
  {
    id: 2,
    type: "professional",
    category: "professional",
    title: "Reliable Plumbing",
    description: "Leaking taps, pipe repairs and plumbing installations.",
    price: 600,
    priceLabel: "From KSh 600",
    location: "Bungoma",
    icon: "🔧",
    cover: "cover-green",
    tag: "Plumbing"
  },
  {
    id: 3,
    type: "professional",
    category: "professional",
    title: "Creative Photography",
    description: "Portraits, events and professional photography.",
    price: 1500,
    priceLabel: "From KSh 1,500",
    location: "Bungoma",
    icon: "📷",
    cover: "cover-purple",
    tag: "Photography"
  },
  {
    id: 4,
    type: "product",
    category: "product",
    title: "Maize Flour — 2 kg",
    description: "Illustrative price for a standard 2 kg packet.",
    price: 160,
    priceLabel: "KSh 160",
    location: "Sample market",
    icon: "🌽",
    cover: "cover-orange",
    tag: "Food"
  },
  {
    id: 5,
    type: "product",
    category: "product",
    title: "Cooking Oil — 1 L",
    description: "Illustrative price for a 1 litre bottle.",
    price: 280,
    priceLabel: "KSh 280",
    location: "Sample market",
    icon: "🛢️",
    cover: "cover-green",
    tag: "Groceries"
  },
  {
    id: 6,
    type: "product",
    category: "product",
    title: "Rice — 1 kg",
    description: "Illustrative price for a 1 kg pack.",
    price: 180,
    priceLabel: "KSh 180",
    location: "Sample market",
    icon: "🍚",
    cover: "cover-blue",
    tag: "Food"
  }
];

const grid = document.getElementById("listingGrid");
const searchInput = document.getElementById("globalSearch");
const searchForm = document.getElementById("searchForm");
const resultCount = document.getElementById("resultCount");
const directoryTitle = document.getElementById("directoryTitle");
const directoryDescription = document.getElementById("directoryDescription");
const emptyState = document.getElementById("emptyState");
const bookingDialog = document.getElementById("bookingDialog");
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const toast = document.getElementById("toast");

let selectedCategory = "all";
let toastTimeout;

function formatKES(amount) {
  return "KSh " + amount.toLocaleString("en-KE");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function renderListings() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = listings.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      item.category === selectedCategory;

    const searchableText = [
      item.title,
      item.description,
      item.location,
      item.tag
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = "";

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "listing-card";

    const cover = document.createElement("div");
    cover.className = `listing-cover ${item.cover}`;

    const icon = document.createElement("span");
    icon.className = "listing-art";
    icon.textContent = item.icon;

    const tag = document.createElement("span");
    tag.className = "listing-type";
    tag.textContent = item.tag;

    cover.append(icon, tag);

    const body = document.createElement("div");
    body.className = "listing-body";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.className = "listing-description";
    description.textContent = item.description;

    const meta = document.createElement("div");
    meta.className = "listing-meta";

    const location = document.createElement("span");
    location.textContent = "⌖ " + item.location;

    const price = document.createElement("span");
    price.className = "listing-price";
    price.textContent = item.priceLabel;

    meta.append(location, price);

    const action = document.createElement("button");
    action.className = "listing-action";

    if (item.type === "professional") {
      action.textContent = "Request booking →";
      action.addEventListener("click", () => openBooking(item));
    } else {
      action.textContent = "View price details →";
      action.classList.add("product-action");

      action.addEventListener("click", () => {
        showToast(
          "Sample price only. Verified shop listings will be added later."
        );
      });
    }

    body.append(title, description, meta, action);
    card.append(cover, body);
    grid.appendChild(card);
  });

  resultCount.textContent =
    filtered.length + (filtered.length === 1 ? " listing" : " listings");

  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;

  if (selectedCategory === "professional") {
    directoryTitle.textContent = "Find a professional";
    directoryDescription.textContent =
      "Explore example service providers.";
  } else if (selectedCategory === "product") {
    directoryTitle.textContent = "Explore market products";
    directoryDescription.textContent =
      "Browse illustrative prices for everyday products.";
  } else {
    directoryTitle.textContent = "Explore local listings";
    directoryDescription.textContent =
      "Sample listings to demonstrate how discovery will work.";
  }
}

function selectCategory(category) {
  selectedCategory = category;

  document.querySelectorAll(".category-card").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.category === category
    );
  });

  if (category === "money") {
    document.getElementById("rates").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    showToast("Explore the currency converter below.");
    return;
  }

  renderListings();

  document.getElementById("services").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

document.querySelectorAll(".category-card").forEach((button) => {
  button.addEventListener("click", () => {
    selectCategory(button.dataset.category);
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  selectedCategory = "all";

  document.querySelectorAll(".category-card").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.category === "all"
    );
  });

  renderListings();

  document.getElementById("services").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

searchInput.addEventListener("input", renderListings);

document.getElementById("resetSearch").addEventListener("click", () => {
  searchInput.value = "";
  selectedCategory = "all";

  document.querySelectorAll(".category-card").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.category === "all"
    );
  });

  renderListings();
});

function openBooking(item) {
  bookingForm.reset();

  document.getElementById("bookingService").value = item.title;

  const dateInput = document.getElementById("bookingDate");
  dateInput.min = new Date().toLocaleDateString("en-CA");

  bookingMessage.textContent = "";

  if (typeof bookingDialog.showModal === "function") {
    bookingDialog.showModal();
  } else {
    showToast("Please use an up-to-date browser to test bookings.");
  }
}

document.getElementById("closeDialog").addEventListener("click", () => {
  bookingDialog.close();
});

bookingDialog.addEventListener("click", (event) => {
  if (event.target === bookingDialog) {
    bookingDialog.close();
  }
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const date = String(formData.get("date") || "");

  if (!name || !phone || !location || !date) {
    bookingMessage.textContent = "Please complete all the required fields.";
    return;
  }

  if (new Date(date + "T00:00:00") <
      new Date(new Date().toDateString())) {
    bookingMessage.textContent = "Please select today or a future date.";
    return;
  }

  // This is a local demonstration only.
  // No information is sent or saved to a server.
  bookingMessage.textContent =
    "Demo successful! Your form passed validation, but no real booking was sent.";

  showToast("Booking form tested successfully.");
});

document.getElementById("viewProducts").addEventListener("click", () => {
  selectCategory("product");
});

// Illustrative rates: KES value of one currency unit.
// These values are NOT live exchange rates.
const ratesInKES = {
  KES: 1,
  USD: 130,
  EUR: 141,
  GBP: 169
};

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const conversionResult = document.getElementById("conversionResult");
const conversionNote = document.getElementById("conversionNote");

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(amount);
}

function convertCurrency() {
  const amount = Number(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!Number.isFinite(amount) || amount < 0) {
    conversionResult.textContent = "Enter a valid amount";
    conversionNote.textContent = "Use zero or a positive number.";
    return;
  }

  const amountInKES = amount * ratesInKES[from];
  const convertedAmount = amountInKES / ratesInKES[to];

  conversionResult.textContent =
    `${formatCurrency(amount, from)} = ${formatCurrency(convertedAmount, to)}`;

  conversionNote.textContent =
    `Illustrative rate only · 1 ${from} = ${formatCurrency(
      ratesInKES[from] / ratesInKES[to], to
    )}`;
}

[amountInput, fromCurrency, toCurrency].forEach((element) => {
  element.addEventListener("input", convertCurrency);
  element.addEventListener("change", convertCurrency);
});

document.getElementById("swapCurrencies").addEventListener("click", () => {
  const previousFrom = fromCurrency.value;

  fromCurrency.value = toCurrency.value;
  toCurrency.value = previousFrom;

  convertCurrency();
});

document.getElementById("year").textContent = new Date().getFullYear();

renderListings();
convertCurrency();
async function testTumiaDatabase() {
  const { data, error } = await tumiaSupabase
    .from("services")
    .select("*")
    .limit(5);

  if (error) {
    console.error("TUMIA database test failed:", error.message);
    return;
  }

  console.log("TUMIA database connected successfully!");
  console.log("Services found:", data);
}

testTumiaDatabase();
async function loadTumiaServices() {
  const servicesGrid = document.getElementById("servicesGrid");

  if (!servicesGrid) {
    console.error("TUMIA services section not found in index.html");
    return;
  }

  servicesGrid.innerHTML = "<p>Loading services...</p>";

  const { data, error } = await tumiaSupabase
    .from("services")
    .select("id, title, category, description, location, price, price_unit")
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Could not load services:", error.message);
    servicesGrid.innerHTML =
      "<p>Sorry, services could not load. Please try again later.</p>";
    return;
  }

  if (!data || data.length === 0) {
    servicesGrid.innerHTML = "<p>No services available yet.</p>";
    return;
  }

  
  function renderServices(services) {
    if (services.length === 0) {
      servicesGrid.innerHTML = "<p>No matching services found.</p>";
      return;
    }

    servicesGrid.innerHTML = services.map(service => `
      <article class="service-card">
        <span class="service-category">${service.category || "Local service"}</span>
        <h3>${service.title}</h3>
        <p>${service.description || "Contact the provider for more information."}</p>
        <p class="service-location">📍 ${service.location || "Location not specified"}</p>
        <p class="service-price">
          KSh ${Number(service.price || 0).toLocaleString("en-KE")}
          ${service.price_unit ? `<span>${service.price_unit}</span>` : ""}
        </p>
      </article>
    `).join("");
  }

  console.log("TUMIA service categories:", data.map(service => service.category));
renderServices(data);

  const searchInput = document.getElementById("serviceSearch");
  const categoryFilter = document.getElementById("categoryFilter");

  function filterServices() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredServices = data.filter(service => {
      const matchesSearch =
        (service.title || "").toLowerCase().includes(searchTerm) ||
        (service.category || "").toLowerCase().includes(searchTerm) ||
        (service.description || "").toLowerCase().includes(searchTerm) ||
        (service.location || "").toLowerCase().includes(searchTerm);

      const matchesCategory =
  !selectedCategory ||
  (service.category || "").trim().toLowerCase() ===
  selectedCategory.trim().toLowerCase();

      return matchesSearch && matchesCategory;
    });

    renderServices(filteredServices);
  }

  searchInput.addEventListener("input", filterServices);
  categoryFilter.addEventListener("change", filterServices);

}

loadTumiaServices();

const providerSignupForm = document.getElementById("providerSignupForm");

if (providerSignupForm) {
  providerSignupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("providerSignupMessage");
    const submitButton = providerSignupForm.querySelector(
      'button[type="submit"]'
    );

    const fullName = document.getElementById("providerFullName").value.trim();
    const email = document.getElementById("providerEmail").value.trim();
    const phone = document.getElementById("providerPhone").value.trim();
    const password = document.getElementById("providerPassword").value;

    message.textContent = "Creating your account...";
    submitButton.disabled = true;

    

try {
  const { data, error } = await tumiaSupabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://petero254-boom.github.io/tumia/",
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  });

  if (error) {
    throw error;
  }

 message.textContent = data.user?.identities?.length === 0
  ? "An account may already exist with this email. Try signing in or use another email."
  : "Account created! Check your email if verification is required. Your account will not automatically approve your services.";

providerSignupForm.reset();

} catch (error) {
  console.error("TUMIA signup error:", error.message);
  message.textContent = error.message || "Signup failed. Please try again.";
} finally {
  submitButton.disabled = false;
}
});
}
