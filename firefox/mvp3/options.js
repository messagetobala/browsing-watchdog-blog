let FILTERED_URLS = 'filtered_urls'

function onError(error) {
    console.log(error)
}

function saveUrl() {
    browser.storage.sync.get(FILTERED_URLS).then(function(items) {
        console.log('Existing URLS in watch list ' + JSON.stringify(items))
        newUrl = document.getElementById("new_url").value;
        if (newUrl != '') {
            console.log('Adding URL to watch list ' + newUrl);
            if (items.hasOwnProperty(FILTERED_URLS)) {
                items[FILTERED_URLS].push(newUrl)
            } else {
                items[FILTERED_URLS] = [ newUrl]
            }
            urlConfig = {}
            urlConfig[FILTERED_URLS] = items[FILTERED_URLS]
            console.log('Updated urls ' + JSON.stringify(urlConfig))
            browser.storage.sync.set(urlConfig).then(restoreFilteredUrls, onError);
        }
        document.getElementById('new_url').value = ''
    }, onError);
}

function removeUrl(url) {
    console.log('Remvoing URL from watch list ' + url)
    browser.storage.sync.get(FILTERED_URLS).then(function(items) {
        console.log('Existing URLS in watch list ' + JSON.stringify(items))
        updateUrls = [];
        if (items.hasOwnProperty(FILTERED_URLS)) {
            items[FILTERED_URLS].forEach(element => {
                if (element != url) {
                    updateUrls.push(element)
                }
            });
            urlConfig = {}
            urlConfig[FILTERED_URLS] = updateUrls
            console.log('Updated urls ' + JSON.stringify(urlConfig))
            browser.storage.sync.set(urlConfig).then(restoreFilteredUrls, onError);
        }
    }, onError);
}

function restoreFilteredUrls() {
    browser.storage.sync.get(FILTERED_URLS).then(function(items) {
        console.log('Existing URLS ' + JSON.stringify(items))
        
        //clear
        document.querySelector('#urls').innerHTML=""
        
        //Add li for adding new url
        let li = document.createElement('li')
        li.innerHTML = '<span><button id="new_url_button">+</button>&nbsp;&nbsp;<input type="text" id="new_url"></input></span>'
        document.querySelector('#urls').appendChild(li)
        console.log('Adding event listener for adding new url')
        document.querySelector('#new_url_button').addEventListener('click', function(){
            saveUrl()
        });

        if (items.hasOwnProperty(FILTERED_URLS)) {
            //Add li for each existing url
            items[FILTERED_URLS].forEach(element => {
                let li = document.createElement('li')
                li.innerHTML = '<span><button value="' + element + '">-</button>&nbsp;' + element + '</span>'
                li.addEventListener('click', function() {
                    removeUrl(element)
                })
                document.querySelector('#urls').appendChild(li)
            });
        }

    }, onError);

}

document.addEventListener('DOMContentLoaded', restoreFilteredUrls);