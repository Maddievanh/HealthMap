let map;
let markers = [];

// ----------------- Section Navigation -----------------
function showSection(id) {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
  const section = document.getElementById(id);
  section.classList.remove('hidden');

  if (id === 'search') {
    if (!map) {
      initMap();
    } else {
      setTimeout(() => map.invalidateSize(), 200);
    }
  }
}

// ----------------- Initialize Map -----------------
function initMap() {
  map = L.map('map').setView([39.8283, -98.5795], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

// ----------------- AI Search -----------------
async function submitQuery() {
  const query = document.getElementById('userQuery').value.trim();
  const results = document.getElementById('results');

  if (!query) {
    results.innerHTML = "<p>Please type a question or city name.</p>";
    return;
  }

  results.innerHTML = "<p><em>Thinking...</em></p>";

  try {
    const response = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn’t find anything.";
    results.innerHTML = `<h3>AI Suggestions</h3><p>${reply}</p>`;

    // Show city on map
    showCityOnMap(query);

  } catch (err) {
    console.error(err);
    results.innerHTML = `<p style="color:red;">Error contacting AI server.</p>`;
  }
}

// ----------------- Show City and Clinics -----------------
async function showCityOnMap(city) {
  if (!city || !map) return;

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  try {
    const res = await fetch('/api/clinics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city })
    });
    const data = await res.json();

    if (!data.city) {
      alert(data.error || 'City not found');
      return;
    }

    map.setView([data.city.lat, data.city.lon], 13);
    map.invalidateSize();

    if (!data.clinics || data.clinics.length === 0) {
      alert('No clinics found nearby!');
      return;
    }

    data.clinics.forEach(c => {
      const marker = L.marker([c.lat, c.lon])
        .addTo(map)
        .bindPopup(`<b>${c.tags.name || 'Clinic'}</b><br>Type: ${c.tags.amenity}`);
      markers.push(marker);
    });

  } catch (err) {
    console.error(err);
    alert('Error fetching clinics');
  }
}

// ----------------- Chat Box -----------------
function sendChat() {
  const chatInput = document.getElementById('chatText');
  const chatMessages = document.getElementById('chat-messages');
  const message = chatInput.value.trim();
  if (!message) return;

  chatMessages.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

  setTimeout(() => {
    chatMessages.innerHTML += `<p><strong>HealthMapp:</strong> Thanks for reaching out! We’re here to help connect you to local care and support programs.</p>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 800);

  chatInput.value = '';
}

window.addEventListener('load', () => showSection('home'));
