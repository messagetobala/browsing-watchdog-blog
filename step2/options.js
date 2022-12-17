function onError(error) {
    console.log(error)
}

function saveUrl() {
    browser.storage.sync.get('urls').then(function(items) {
        console.log('Existing URLS in watch list' + JSON.stringify(items))
        newUrl = document.getElementById("new_url").value;
        if (newUrl != '') {
            console.log("Adding URL to watch list" + newUrl);
            items.urls.push(newUrl)
            browser.storage.sync.set({ 'urls' : items.urls}).then(restoreOptions, onError);
        }
        document.getElementById("new_url").value = ''
    }, onError);
}

function removeUrl(url) {
    console.log("Remvoing URL from watch list" + url)
    browser.storage.sync.get('urls').then(function(items) {
        console.log('Existing URLS in watch list' + JSON.stringify(items))
        updateUrls = [];
        items.urls.forEach(element => {
            if (element != url) {
                updateUrls.push(element)
            }
        });
        console.log('List of URLS in watch list' + updateUrls)
        browser.storage.sync.set({ 'urls' : updateUrls}).then(restoreOptions, onError);
    }, onError);
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