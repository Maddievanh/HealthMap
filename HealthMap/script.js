function startSearch(type) {
  document.getElementById('search-section').classList.remove('hidden');
  document.getElementById('results').innerHTML = '';
  document.getElementById('userQuery').value = `I need help with ${type} care.`;
}

function submitQuery() {
  const query = document.getElementById('userQuery').value;
  const resultsBox = document.getElementById('results');

  // Simulate AI response (you'll replace this with real API call later)
  resultsBox.innerHTML = `
    <h3>Top Matches for: "${query}"</h3>
    <ul>
      <li><strong>Community Health Clinic</strong> - Free for uninsured patients, open M-F</li>
      <li><strong>Low-Cost Therapy Center</strong> - Sliding scale pricing available</li>
      <li><strong>RXHelp Program</strong> - Discounts on generic medications</li>
    </ul>
  `;

  document.getElementById('summary').classList.remove('hidden');
}
