export default function decorate(block) {
  const container = document.createElement('nav');
  container.setAttribute('aria-label', 'Breadcrumb');
  container.classList.add('breadcrumb-container');

  updateBreadcrumbs(container);
  block.appendChild(container);
}

function updateBreadcrumbs(breadcrumbContainer) {
  if (!breadcrumbContainer) {
    console.warn("Breadcrumb container not found.");
    return;
  }

  // Clear existing breadcrumbs
  breadcrumbContainer.innerHTML = '';

  // Get the current path
  const path = window.location.pathname;
  const pathSegments = path.split('/').filter(segment => segment !== '');

  /*Create a "Home" link
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  const homeListItem = document.createElement('li');
  homeListItem.appendChild(homeLink);
  breadcrumbContainer.appendChild(homeListItem);*/

  let currentPath = '';
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = decodeURIComponent(pathSegments[i]);
    currentPath += '/' + segment;

    const listItem = document.createElement('li');
    if (i === pathSegments.length - 1) {
      // Last item is the current page, no link
      const span = document.createElement('span');
      span.textContent = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter
      listItem.appendChild(span);
      listItem.setAttribute('aria-current', 'page');
    } else {
      const link = document.createElement('a');
      link.href = currentPath;
      link.textContent = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter
      listItem.appendChild(link);
    }

    if (i < pathSegments.length - 1) {
      breadcrumbContainer.appendChild(listItem);
    } else {
      breadcrumbContainer.appendChild(listItem);
    }
  }
}