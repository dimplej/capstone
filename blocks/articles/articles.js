export default async function decorate(block) {
  const container = document.createElement("div");
  container.classList.add("articles");

  // Manually hardcoded JSON source (change this to your live URL)
  const jsonUrl = 'https://main--capstone--dimplej.aem.live/query-index.json';

  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();

    if (Array.isArray(json.data)) {
      json.data.forEach((item) => {
        const article = document.createElement("div");
        article.classList.add("article");

        article.innerHTML = `
          <h3>${item.Title || 'Untitled'}</h3>
          ${item.Image ? `<img src="${item.Image}" alt="${item.Title}" />` : ''}
          <p>${item.Description || ''}</p>
        `;

        container.appendChild(article);
      });
    } else {
      container.textContent = "No valid article data found.";
    }

  } catch (err) {
    console.error("Failed to load JSON:", err);
    container.textContent = "Could not load articles.";
  }

  // Replace the block content
  block.innerHTML = '';
  block.appendChild(container);
}
