function getHostname(url) {
  let a = document.createElement("a");
  a.href = url;
  return a.hostname
}

function messageTab(tabs) {
  browser.storage.sync.get('urls').then(function(items) {
    url = getHostname(tabs[0].url)
    console.log('Active URL' + url)
    if(items.urls.includes(url)) {
      browser.tabs.sendMessage(tabs[0].id, {
        replacement: url
      })
    }
  })
}

function onExecuted(result) {
    let querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(messageTab);
}

function addContentScript(requestDetails) {
    console.log(`Loading content script into : ${requestDetails.url}`);
    let executing = browser.tabs.executeScript({
      file: "content-script.js"
    });
    browser.tabs.insertCSS({file: "content-style.css"});
    executing.then(onExecuted);
}

function addListener(items) {
  browser.webNavigation.onCompleted.removeListener(addContentScript)

  filterdUrls = []
  items.urls.forEach(element => {
    url = { 'hostEquals': element}
    filterdUrls.push(url)
  })

  if (filterdUrls.length > 0)
  {
    console.log('Adding listener for urls ' + JSON.stringify(filterdUrls))
    filter = {url : filterdUrls}

    browser.webNavigation.onCompleted.addListener(
      addContentScript,
      filter
    )
  }
}

/**
 * When loaded get the urls from configuration and
 * add a listener to add content script to those URL's.
 */
browser.storage.sync.get('urls').then(function(items) {
  addListener(items)
})


function logStorageChange(changes, area) {
  console.log(`Change in storage area: ${area}`);

  const changedItems = Object.keys(changes);

  for (const item of changedItems) {
    if (item == 'urls')
    {
      browser.storage.sync.get('urls').then(function(items) {
        addListener(items)
      })
      break
    }
  }
}

browser.storage.onChanged.addListener(logStorageChange);





