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
    .filter(a => a.path?.startsWith('/magazine') && a.title) // only /magazine paths
    .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0)) // descending sort
    .forEach(article => {
      const item = document.createElement('li');
      item.classList.add('article-item');

      const link = document.createElement('a');
      link.href = article.path;

      if (withImage) {
        if (article.image) {
          const img = document.createElement('img');
          img.src = article.image;
          link.appendChild(img);
        }

        const title = document.createElement('div');
        title.textContent = article.title;
        link.appendChild(title);

        const desc = document.createElement('p');
        desc.classList.add('article-description');
        desc.textContent = article.description || '';
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
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
