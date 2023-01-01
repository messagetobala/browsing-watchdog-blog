let FILTERED_URLS = 'filtered_urls'
function modifyContent() {
    document.body.textContent = ""

    let bodyDiv = document.createElement('div')
    bodyDiv.setAttribute("id", "body")
    
    let headerSection = document.createElement('section')
    headerSection.setAttribute("id", "header")
    
    let headerPara_1 = document.createElement('p')
    headerPara_1.textContent = 'A slight change in your daily habits can guide your life to a very different destination.'
    
    let headerPara_2 = document.createElement('p')
    headerPara_2.textContent = '- James Clear'
    
    headerSection.appendChild(headerPara_1)
    headerSection.appendChild(headerPara_2)
    
    bodyDiv.appendChild(headerSection)
    document.body.appendChild(bodyDiv);
}

function getHostname() {
    return new URL(window.location.href).hostname
}

browser.storage.sync.get(FILTERED_URLS).then(function(items) {
    if (items.hasOwnProperty(FILTERED_URLS) && 
    items[FILTERED_URLS].includes(getHostname())) {
        modifyContent();
    }
})

