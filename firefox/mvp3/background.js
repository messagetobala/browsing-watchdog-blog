let FILTERED_URLS = 'filtered_urls'
let filteredUrls = []

function addContentScript(tabs) {
    console.log('filter urls ' + JSON.stringify(filteredUrls))
    console.log('Current tab url ' + tabs[0].url)
    currentUrl = new URL(tabs[0].url)
    console.log('Current tab url' + currentUrl.hostname)
    if (filteredUrls.includes(currentUrl.hostname)) {
        console.log(`Loading content script into : ${currentUrl.hostname}`);
        browser.tabs.insertCSS({file: "content-style.css"});
        browser.tabs.executeScript({file: "content-script.js"});
    } else {
        console.log('Current tab url not matched')
    }
}

function getCurrentTabAndAddContentScript(requestDetails) {
    let querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(addContentScript);

}

function addListener(items) {
    browser.webNavigation.onCompleted.removeListener(getCurrentTabAndAddContentScript)
    browser.webNavigation.onHistoryStateUpdated.removeListener(getCurrentTabAndAddContentScript)
    
    urlFilters=[]
    if (items.hasOwnProperty(FILTERED_URLS)) {
      filteredUrls=items[FILTERED_URLS]
      items[FILTERED_URLS].forEach(element => {
        url = { 'hostEquals': element}
        urlFilters.push(url)
      })
    }
  
    if (urlFilters.length > 0)
    {
      console.log('Adding listener for urls ' + JSON.stringify(urlFilters))
      filter = {url : urlFilters}
  
      browser.webNavigation.onCompleted.addListener(
        getCurrentTabAndAddContentScript,
        filter
      )
    
      browser.webNavigation.onHistoryStateUpdated.addListener(
        getCurrentTabAndAddContentScript,
        filter
      )
    }
}

/**
 * When loaded get the urls from configuration and
 * add a listener to add content script to those URL's.
 */
browser.storage.sync.get(FILTERED_URLS).then(function(items) {
    console.log('Current filtered urls' + JSON.stringify(items))
    addListener(items)
})

function logStorageChange(changes, area) {
    console.log(`Change in storage area: ${area}`);

    const changedItems = Object.keys(changes);

    for (const item of changedItems) {
        if (item == FILTERED_URLS) {
          browser.storage.sync.get(FILTERED_URLS).then(function(items) {
              addListener(items)
          })
        }
    }
}
  
browser.storage.onChanged.addListener(logStorageChange)
