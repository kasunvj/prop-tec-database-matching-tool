document.getElementById('filterForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  

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


document.addEventListener('DOMContentLoaded', () => {
  fetch('/dropdown-geo')
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('dropdown-geo');
      dropdown.innerHTML = '';  // Clear existing options
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error loading dropdown data:', error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/dropdown-part')
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('dropdown-part');
      dropdown.innerHTML = '';  // Clear existing options
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error loading dropdown data:', error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/dropdown-series')
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('dropdown-series');
      dropdown.innerHTML = '';  // Clear existing options
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error loading dropdown data:', error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/dropdown-medium')
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('dropdown-medium');
      dropdown.innerHTML = '';  // Clear existing options
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error loading dropdown data:', error);
    });
});


document.getElementById('dropdown-geo').addEventListener('change', () => {
  const selectedOptions = Array.from(document.getElementById('dropdown').selectedOptions);
  const selectedValues = selectedOptions.map(option => option.value);
  console.log('Selected values:', selectedValues);
});

document.getElementById('dropdown-part').addEventListener('change', () => {
  const selectedOptions = Array.from(document.getElementById('dropdown').selectedOptions);
  const selectedValues = selectedOptions.map(option => option.value);
  console.log('Selected values:', selectedValues);
});

document.addEventListener('DOMContentLoaded', () => {
  const tagInput = document.getElementById('tagInput');
  const tagContainer = document.getElementById('tagContainer');
  const tags = new Set();  // Use Set to avoid duplicate tags

  function addTag(tagText) {
    if (tagText.trim() && !tags.has(tagText)) {
      tags.add(tagText);  // Add to Set to prevent duplicates
      const tag = document.createElement('span');
      tag.className = 'badge badge-primary m-1';
      tag.textContent = tagText;

      // Add remove button for tag
      const removeBtn = document.createElement('span');
      removeBtn.className = 'ml-2 text-white';
      removeBtn.style.cursor = 'pointer';
      removeBtn.textContent = 'x';
      removeBtn.onclick = () => {
        tags.delete(tagText);  // Remove from Set
        tagContainer.removeChild(tag);
      };

      tag.appendChild(removeBtn);
      tagContainer.appendChild(tag);
    }
  }

  tagInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag(tagInput.value);
      tagInput.value = '';  // Clear input field
    }
  });
});


