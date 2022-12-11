const filter = {
  url:
  [
    {hostEquals: "youtube.com"},
    {hostEquals: "www.youtube.com"},
    {hostEquals: "espncricinfo.com"},
    {hostEquals: "www.espncricinfo.com"}
  ]
}


function messageTab(tabs) {
  browser.tabs.sendMessage(tabs[0].id, {
    replacement: tabs[0].url
  });
}

function onExecuted(result) {
    let querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(messageTab);
}

function logURL(requestDetails) {
    console.log(`Loaded: ${requestDetails.url}`);
    let executing = browser.tabs.executeScript({
      file: "content-script.js"
    });
    browser.tabs.insertCSS({file: "content-style.css"});
    executing.then(onExecuted);
}
  
browser.webNavigation.onCompleted.addListener(
  logURL,
  filter
);