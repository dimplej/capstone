export default async function decorate(block) {
  const articleLink = block.querySelector('a[href$=".json"]');
  if (!articleLink) return;

  const response = await fetch(new URL(articleLink.href).pathname);
  const magazineArticles = await response.json();
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
        img.alt = article.title;

        const title = document.createElement('div');
        title.textContent = article.title;

        const desc = document.createElement('p');
        desc.classList.add('article-description');
        desc.textContent = article.description || '';

        link.appendChild(title);
        item.append(img, link, desc);
      }

      if (noImage) {
        const title = document.createElement('span');
        title.textContent = article.title;

        const date = document.createElement('span');
        date.classList.add('last-modified-date');
        date.textContent = formatDate(article.lastModified);

        link.append(title, date);
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
