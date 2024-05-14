function createCatalogueLink() {
  console.log("Astia page was updated! Updating link!");
  const urlParams = new URLSearchParams(window.location.search);
  const fileId = urlParams.get("fileId");
  const aineistoId = urlParams.get("aineistoId");
  const inputValue = document.getElementById("page-number").value;

  if (fileId && aineistoId) {
    const linkUrl = `https://digihakemisto.net/item/${aineistoId}/${fileId}/${inputValue}`;
    fetch(chrome.runtime.getURL("linkContainer.html"))
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const linkContainer = doc.getElementById("digihakemisto-link");
        linkContainer.href = linkUrl;

        // Check if link already exists to avoid duplicates
        const existingLink = document.getElementById("digihakemisto-link");
        if (!existingLink) {
          const targetElement = document.querySelector(
            ".image-toolbar.view-toolbar"
          );
          if (targetElement) {
            targetElement.insertBefore(linkContainer, targetElement.firstChild);
          } else {
            console.error("Place to put link was not found!");
          }
        } else {
          existingLink.href = linkUrl;
        }
      })
      .catch((error) => console.error("Something went wrong!", error));
  }
}

// Polling function to repeatedly check the URL
function checkURLChange() {
  let lastURL = "";
  setInterval(() => {
    console.log("Checking if link needs updating");
    const currentURL = window.location.href;
    if (currentURL !== lastURL) {
      lastURL = currentURL;
      createCatalogueLink(); // Create the link if URL changes
    }
  }, 1000); // Check every 1000 milliseconds (1 second)
}

checkURLChange(); // Initialize the URL checking
