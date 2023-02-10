let FILTERED_URLS = 'filtered_urls'
let filteredUrls = []


function addContentScript(tabs) {
    console.log('filter urls ' + JSON.stringify(filteredUrls))
    currentUrl = new URL(tabs[0].url)
    console.log('Current tab url' + currentUrl.hostname)
    if (filteredUrls.includes(currentUrl.hostname)) {
        console.log(`Loading content script into : ${currentUrl.hostname}`);
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: [ "content-script.js" ]
        });
    
        chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            files: [ "content-style.css" ]
        });
     
    } else {
        console.log('Current tab url not matched')
    }
}

function getCurrentTabAndAddContentScript(requestDetails) {
    let querying = chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(addContentScript);

}

function addListener(items) {
    chrome.webNavigation.onCompleted.removeListener(getCurrentTabAndAddContentScript)
    chrome.webNavigation.onHistoryStateUpdated.removeListener(getCurrentTabAndAddContentScript)
    
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
  
      chrome.webNavigation.onCompleted.addListener(
        getCurrentTabAndAddContentScript,
        filter
      )
    
      chrome.webNavigation.onHistoryStateUpdated.addListener(
        getCurrentTabAndAddContentScript,
        filter
      )
    }
}

function logStorageChange(changes, area) {
    console.log(`Change in storage area: ${area}`);

    const changedItems = Object.keys(changes);

    for (const item of changedItems) {
        if (item == FILTERED_URLS) {
            chrome.storage.sync.get(FILTERED_URLS).then(function(items) {
                addListener(items)
            })
        }
    }
}

/**
 * When loaded get the urls from configuration and
 * add a listener for webNavigation events.
 */
chrome.storage.sync.get(FILTERED_URLS).then(function(items) {
    console.log('Current filtered urls' + JSON.stringify(items))
    addListener(items)
})

/**
 * Add a listener to for change in storage.
 */
chrome.storage.onChanged.addListener(logStorageChange);

