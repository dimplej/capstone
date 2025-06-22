export default async function decorate(block) {
  const jsonLink = block.querySelector('a[href$=".json"]');
  if (!jsonLink) return;

  let data;
  try {
    const res = await fetch(new URL(jsonLink.href).pathname);
    data = (await res.json()).data;
    console.log(data);
  } catch {
    console.error('Failed to fetch articles JSON');
    return;
  }


  // Filter and sort: only /magazine items with images, sorted by lastModified
  const filteredData = data
    .filter((item) =>
      item.path?.startsWith('/magazine') &&
      item.image &&
      item.image.trim() !== ''
    )
    .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));

  const path = window.location.pathname;
  const isIndexPage = path === '/' || path.endsWith('/index') || path.endsWith('/index.html');
  console.log(path);
  console.log("is index page : " + isIndexPage);
  // Slice only first 4 if on index page
  const articlesToRender = isIndexPage ? filteredData.slice(0, 4) : filteredData;
  console.log("articles: " + JSON.stringify(filteredData, null, 2));

  const ul = document.createElement('ul');

  articlesToRender.forEach((item) => {
    const li = document.createElement('li');

    // Image
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'articles-card-image';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    imageWrapper.appendChild(img);

    // Body
    const body = document.createElement('div');
    body.className = 'articles-card-body';

    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = item.path;
    titleLink.textContent = item.title;
    title.appendChild(titleLink);

    const desc = document.createElement('p');
    desc.textContent = item.description;

    const date = document.createElement('p');
    date.className = 'articles-card-date';
    if (item.lastModified) {
      date.textContent = `Last updated: ${formatDate(item.lastModified)}`;
    }

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(date);

    li.appendChild(imageWrapper);
    li.appendChild(body);
    ul.appendChild(li);
  });
console.log("block is : "+block.innerHTML);
  block.innerHTML = '';
  block.append(ul);
}

function formatDate(ts) {
  if (!ts) return 'Date Unknown';
  const d = new Date(ts * 1000); // assuming timestamp is in seconds
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
