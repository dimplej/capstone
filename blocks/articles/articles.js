export default async function decorate(block) {
  const articleLink = block.querySelector('a[href$=".json"]');
  if (!articleLink) return;

  const response = await fetch(new URL(articleLink.href).pathname);
  const magazineArticles = await response.json();
  console.log("Fetched Data:", magazineArticles);

  const withImage = block.classList.contains('with-image');
  const noImage = block.classList.contains('no-image');

  block.innerHTML = '';
  const list = document.createElement('ul');
  list.classList.add('articles-items-list');

  magazineArticles.data
    .filter(article => article.path?.startsWith('/magazine') && article.title)
    .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))
    .forEach(article => {
      const item = document.createElement('li');
      item.classList.add('article-item');

      const link = document.createElement('a');
      link.href = article.path;

      if (withImage) {
        const img = document.createElement('img');
        img.src = article.image || 'https://via.placeholder.com/260x200?text=No+Image';

        const title = document.createElement('div');
        title.textContent = article.title;

        const desc = document.createElement('p');
        desc.classList.add('article-description');
        desc.textContent = article.description || 'No description available.';

        link.appendChild(img);
        link.appendChild(title);
        item.append(link, desc);
      } else if (noImage) {
        const title = document.createElement('span');
        title.textContent = article.title;

        const modified = document.createElement('span');
        modified.classList.add('last-modified-date');
        modified.textContent = formatDate(article.lastModified);

        link.append(title, modified);
        item.append(link);
      }

      list.appendChild(item);
    });

  block.appendChild(list);
}

function formatDate(timestamp) {
  if (!timestamp) return 'Date Unknown';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
