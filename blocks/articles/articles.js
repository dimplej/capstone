export default async function decorate(block) {
  const jsonLink = block.querySelector('a[href$=".json"]');
  if (!jsonLink) return;

  let data;
  try {
    const res = await fetch(new URL(jsonLink.href).pathname);
    data = (await res.json()).data;
  } catch {
    console.error('Failed to fetch articles JSON');
    return;
  }

  const withImage = block.classList.contains('with-image');
  const noImage = block.classList.contains('no-image');
  const list = document.createElement('ul');
  list.className = 'articles-items-list';

  data
    .filter(a => a.path?.startsWith('/magazine') && a.title)
    .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))
    .forEach(a => {
      const li = document.createElement('li');
      li.className = 'article-item';
      const link = document.createElement('a');
      link.href = a.path;

      if (withImage) {
        const img = document.createElement('img');
        img.src = a.image || 'https://via.placeholder.com/260x200';
        img.alt = a.title;
        const title = document.createElement('div');
        title.textContent = a.title;
        const desc = document.createElement('p');
        desc.className = 'article-description';
        desc.textContent = a.description || '';
        link.append(title);
        li.append(img, link, desc);
      } else {
        const title = document.createElement('span');
        title.textContent = a.title;
        const date = document.createElement('span');
        date.className = 'last-modified-date';
        date.textContent = formatDate(a.lastModified);
        link.append(title, date);
        li.append(link);
      }

      list.append(li);
    });

  block.innerHTML = '';
  block.append(list);
}

function formatDate(ts) {
  if (!ts) return 'Date Unknown';
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
  });
}
