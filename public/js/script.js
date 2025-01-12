document.getElementById('filterForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  console.log(data)
  const selectedValues_geo = formData.getAll("dropdown_geo");
  const selectedValues_part = formData.getAll("dropdown_part");
  const selectedValues_medium = formData.getAll("dropdown_medium");
  const selectedValues_series = formData.getAll("dropdown_series");
  const tags = formData.getAll("tagInput");
  data["dropdown_geo"] = selectedValues_geo;
  data["dropdown_part"] = selectedValues_part;
  data["dropdown_medium"] = selectedValues_medium;
  data["dropdown_series"] = selectedValues_series;
  data["tags"] = tags;
  
  

  const response = await fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  const resultsContainer = document.getElementById('results');
  if (result.success) {
    resultsContainer.innerHTML = result.results
      .map(row => {
        // Assume the first item in the row is the title
        const title = row[0]; // First item as the title
        const content = row.slice(1); // Rest of the items as content
        
        return `
          <div class="card mb-3">
            <div class="card-header">
              <strong>${title}</strong>  <!-- Display the title -->
            </div>
            <div class="card-body">
              ${content.map(item => `<p class="card-text">${item}</p>`).join('')}
            </div>
          </div>
        `;
      })
      .join('');
  } else {
    resultsContainer.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
  }
  

});


document.getElementById('dropdown_geo').addEventListener('change', () => {
  const selectedOptions = Array.from(document.getElementById('dropdown_geo').selectedOptions);
  const selectedValues = selectedOptions.map(option => option.value);
  console.log('Selected values:', selectedValues);
});

document.getElementById('dropdown_part').addEventListener('change', () => {
  const selectedOptions = Array.from(document.getElementById('dropdown_part').selectedOptions);
  const selectedValues = selectedOptions.map(option => option.value);
  console.log('Selected values:', selectedValues);
});

document.getElementById('dropdown_series').addEventListener('change', () => {
  const selectedOptions = Array.from(document.getElementById('dropdown_series').selectedOptions);
  const selectedValues = selectedOptions.map(option => option.value);
  console.log('Selected values:', selectedValues);
});

document.getElementById('dropdown_medium').addEventListener('change', () => {
  const selectedOptions = Array.from(document.getElementById('dropdown_medium').selectedOptions);
  const selectedValues = selectedOptions.map(option => option.value);
  console.log('Selected values:', selectedValues);
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/dropdown_geo')
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('dropdown_geo');
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
  fetch('/dropdown_part')
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('dropdown_part');
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
  fetch('/dropdown_series')
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('dropdown_series');
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
  fetch('/dropdown_medium')
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('dropdown_medium');
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
  const tagInput = document.getElementById('tagInput');
  const tagContainer = document.getElementById('tagContainer');
  
  

  function addTag(tagText) {
    if (tagText.trim() && !tags.has(tagText)) {
      const tags = new Set();  // Use Set to avoid duplicate tags
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


