async function getJson(block) {
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
      item.image.trim() !== ''
    )
    .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
  // Slice only first 4 if on index page
const articlesToRender = filteredData.slice(0, 4);
  console.log("articles: " + JSON.stringify(filteredData, null, 2));

  const ul = document.createElement('ul');

  articlesToRender.forEach((item) => {
    const li = document.createElement('li');

    // Body
    const body = document.createElement('div');
    body.className = 'articles-card-body';

    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = item.path;
    titleLink.textContent = item.title;
    title.appendChild(titleLink);

    const date = document.createElement('p');
    date.className = 'articles-card-date';
    if (item.lastModified) {
      date.textContent = `${formatDate(item.lastModified)}`;
    }

    body.appendChild(title);
    body.appendChild(date);
    li.appendChild(body);
    ul.appendChild(li);
  });
 const buttonContainer = block.querySelector('.button-container');
  if (buttonContainer) buttonContainer.remove();
  block.appendChild(ul);

  block.append(ul)
}

function formatDate(ts) {
  if (!ts) return 'DATE UNKNOWN';
  const d = new Date(ts * 1000); // assuming timestamp is in seconds

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const parts = d.toLocaleDateString('en-GB', options).split(' ');
  // Example output: ["Thursday,", "19", "Jun", "2025"]

  // Add comma after the day (2nd part)
  if (parts.length >= 4) {
    parts[0] = parts[0]+',';
  }

  console.log(parts);
  return parts.join(' ').toUpperCase();
}



export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
      const json = col.querySelector('a[href$=".json"]');
      if(json){
        getJson(col);
        
      }
    });
  });
}

