import { getMetadata, wrapTextNodes } from '../../scripts/aem.js';

export default async function decorate(block) {

    const navMeta = getMetadata('top-bar');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
    block.textContent = "";
    if (navPath && navPath.startsWith('/')) {
    const resp = await fetch(`${navPath}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      // reset base navPath for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(navPath, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');
      
      var filteredFragments = Array.from(main.children).filter(function(child){
          return child.firstElementChild.classList.contains("top-bar") == true || child.firstElementChild.classList.contains("form") == true;
      })

      const topBarContainer = document.createElement("div");
      topBarContainer.classList = "section top-bar-container";

      const topBarWrapper = document.createElement("div");
      topBarWrapper.classList = "top-bar-wrapper";

      const formContainer = document.createElement("div");
      formContainer.classList = "section form-container";

      const formWrapper = document.createElement("div");
      formWrapper.classList = "form-wrapper";

      filteredFragments.forEach(function(child){
        wrapTextNodes(child.firstElementChild)
        if(child.firstElementChild.classList.contains("top-bar")){
            topBarWrapper.append(child.firstElementChild);
        }else{
            formWrapper.append(child.firstElementChild);
        }
      });
      //wrapTextNodes(topBarWrapper);
      topBarContainer.appendChild(topBarWrapper);
      formContainer.appendChild(formWrapper);

      

      block.innerHTML = '';
      block.append(topBarContainer);
      block.append(formContainer);
      
    }
  }
  
  // Add click event to toggle form visibility
  const signInButton = block.querySelector('.top-bar-container');
  if (signInButton) {
    signInButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      const formDiv = block.querySelector(".form-container");
      if (formDiv) {
        const isVisible = formDiv.style.display === "block";
        formDiv.style.display = isVisible ? "none" : "block";

        // Add event listener to close the form when clicking outside
        if (!isVisible) {
          const closeOnOutsideClick = (event) => {
            const formWrapper = formDiv.querySelector('.form-wrapper');
            // Check if the click is outside the form-wrapper and not on the sign-in button
            if (!formWrapper.contains(event.target) && !signInButton.contains(event.target)) {
              formDiv.style.display = "none";
              document.removeEventListener('click', closeOnOutsideClick);
            }
          };
          // Use setTimeout to avoid immediately closing the form due to the current click event
          setTimeout(() => {
            document.addEventListener('click', closeOnOutsideClick);
          }, 0);
        }
      }
    });
  }


    
}