function createCatalogueLink() {
  console.log("Astia page was updated! Updating link!");
  const urlParams = new URLSearchParams(window.location.search);
  const fileId = urlParams.get("fileId");
  const aineistoId = urlParams.get("aineistoId");
  const inputValue = document.getElementById("page-number").value;

  if (fileId && aineistoId) {
    const linkUrl = `https://digihakemisto.net/item/${aineistoId}/${fileId}/${inputValue}`;
    fetch(chrome.runtime.getURL("linkTemplate.html"))
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const linkTemplate = doc.getElementById("digihakemisto-link");
        linkTemplate.href = linkUrl;

        // Check if link already exists to avoid duplicates
        const existingLink = document.getElementById("digihakemisto-link");
        if (existingLink) {
          existingLink.href = linkUrl;
        } else {
          const targetElement = document.querySelector(".image-toolbar.view-toolbar");
          if (targetElement) {
            targetElement.insertBefore(linkTemplate, targetElement.firstChild);
          } else {
            console.error("Unable to add link! Parent element for link button was not found.");
          }
        }
      })
      .catch((error) => console.error("Template data could not be retrieved!", error));
  }
}

// Polling function to repeatedly check the URL
function checkURLChange() {
  let lastURL = "";
  setInterval(() => {
    const currentURL = window.location.href;
    if (currentURL !== lastURL) {
      lastURL = currentURL;
      createCatalogueLink(); // Create the link if URL changes
    }
  }, 1000); // Check every 1000 milliseconds (1 second)
}

checkURLChange(); // Initialize the URL checking
