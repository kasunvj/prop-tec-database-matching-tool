document.getElementById('filterForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = result.success
    ? result.results.map(row => `<div>${row.join(' - ')}</div>`).join('')
    : `<div>${result.message}</div>`;
});

