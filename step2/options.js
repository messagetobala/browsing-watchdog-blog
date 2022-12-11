function onError(error) {
    console.log(error)
}

function saveUrl() {
    browser.storage.sync.get('urls').then(function(items) {
        console.log('Existing URLS' + JSON.stringify(items))
        newUrl = document.getElementById("new_url").value;
        if (newUrl != '') {
            console.log("Adding URL" + newUrl);
            items.urls.push(newUrl)
            browser.storage.sync.set({ 'urls' : items.urls}).then(restoreOptions, onError);
        }
        document.getElementById("new_url").value = ''
    }, onError);
}

function removeUrl(url) {
    console.log("Remvoing URL " + url)
    browser.storage.sync.get('urls').then(function(items) {
        console.log('Existing URLS' + JSON.stringify(items))
        updateUrls = [];
        items.urls.forEach(element => {
            if (element != url) {
                updateUrls.push(element)
            }
        });
        console.log('New URLS' + updateUrls)
        browser.storage.sync.set({ 'urls' : updateUrls}).then(restoreOptions, onError);
    }, onError);
}

function saveUrlCallback(items) {
    console.log(items)
    urls = ["youtube.com", "espncricinfo.com"]
    newUrl = document.getElementById("new_url").value;
    console.log("Adding URL" + newUrl)
    urls.push(newUrl)
    browser.storage.sync.set({ 'urls' : urls}).then(restoreOptions, onError);
    restoreOptions();
}

function removeUrlCallback(items) {
    console.log(items)
    url = 'youtube.com'
    urls = ["youtube.com", "espncricinfo.com"]
    updateUrls = [];
    urls.forEach(element => {
        if (element != url) {
            updateUrls.push(element)
        }
    });
    console.log('New URLS' + updateUrls)
}
function restoreOptions() {
    browser.storage.sync.get('urls').then(function(items) {
        console.log('Existing URLS' + JSON.stringify(items))
        
        //clear
        document.querySelector("#urls").innerHTML=""
        
        //Add li for adding new url
        let li = document.createElement('li')
        li.innerHTML = '<span><button id="new_url_button">+</button>&nbsp;&nbsp;<input type="text" id="new_url"></input></span>'
        document.querySelector("#urls").appendChild(li)
        console.log('Adding event listener for adding new url')
        document.querySelector("#new_url_button").addEventListener('click', function(){
            saveUrl()
        });

        //Add li for each existing url
        items.urls.forEach(element => {
            let li = document.createElement('li')
            li.innerHTML = '<span><button value="' + element + '">-</button>&nbsp;' + element + '</span>'
            li.addEventListener('click', function() {
                removeUrl(element)
            })
            document.querySelector("#urls").appendChild(li)
        });
    }, onError);

}

document.addEventListener('DOMContentLoaded', restoreOptions);