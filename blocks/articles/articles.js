export default async function decorate(block) {
    const articleLink = block.querySelector('a[href$=".json"]');
    const response = await fetch(new URL(articleLink.href).pathname);
    const magazineArticles = await response.json();
    const noImageAttr = block.classList.contains('no-image');
    const imageAttr = block.classList.contains('with-image');

    block.innerHTML = '';

    const articlesList = document.createElement('ul');
    articlesList.classList.add('articles-items-list');

    magazineArticles.data.sort((art1, art2) => art2.lastModified - art1.lastModified);
    magazineArticles.data.forEach((article) => {
        if (article.path && article.path.startsWith('/magazine') && !article.path.endsWith('/magazine/')) {
            const articleItem = document.createElement('li');
            articleItem.classList.add('article-item');

            const articleTitle = document.createElement('a');
            articleTitle.href = article.path;

            if (noImageAttr) {
                const titleSpan = document.createElement('span');
                titleSpan.textContent = article.title;

                const lastModified = document.createElement('span');
                lastModified.classList.add('last-modified-date');
                lastModified.textContent = formatDate(article.lastModified);

                articleTitle.append(titleSpan, lastModified);
                articleItem.append(articleTitle);
            } else if (imageAttr) {
                articleTitle.textContent = article.title;

                const thumbnail = document.createElement('img');
                thumbnail.src = article.image;

                const description = document.createElement('p');
                description.classList.add('article-description');
                description.textContent = article.description;

                articleItem.append(thumbnail, articleTitle, description);
            }
            articlesList.append(articleItem);
        }
    });

    block.append(articlesList);
}

function formatDate(lastModified) {
    const date = new Date(lastModified * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const [weekday, monthDay, year] = formattedDate.split(', ');
    const [month, day] = monthDay.split(' ');
    return `${weekday}, ${day} ${month} ${year}`;
}