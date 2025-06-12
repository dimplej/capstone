export default async function decorate(block) {
    const articleLink = block.querySelector('a[href$=".json"]');
    const response = await fetch(new URL(articleLink.href).pathname);
    const magazineArticles = await response.json();
    const noImageAttr = block.classList.contains('no-image');
    const imageAttr = block.classList.contains('with-image');

    block.innerHTML = '';
    const articlesList = document.createElement('ul');
    articlesList.classList.add('articles-items-list');

    // Sort by lastModified (fallback to 0 if empty)
    magazineArticles.data.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));

    magazineArticles.data.forEach((article) => {
        if (article.path && article.path.startsWith('/magazine') && !article.path.endsWith('/magazine/')) {
            const item = document.createElement('li');
            item.classList.add('article-item');

            const link = document.createElement('a');
            link.href = article.path;

            if (noImageAttr) {
                const titleSpan = document.createElement('span');
                titleSpan.textContent = article.title;

                const dateSpan = document.createElement('span');
                dateSpan.classList.add('last-modified-date');
                dateSpan.textContent = formatDate(article.lastModified);

                link.append(titleSpan, dateSpan);
                item.append(link);
            } else if (imageAttr) {
                if (article.image) {
                    const img = document.createElement('img');
                    img.src = article.image;
                    item.append(img);
                }

                const title = document.createElement('a');
                title.href = article.path;
                title.textContent = article.title;

                const desc = document.createElement('p');
                desc.classList.add('article-description');
                desc.textContent = article.description;

                item.append(title, desc);
            }

            articlesList.append(item);
        }
    });

    block.append(articlesList);
}

function formatDate(lastModified) {
    if (!lastModified) return 'Date Unknown';
    const date = new Date(lastModified * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
