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
    document.body.appendChild(bodyDiv)
}

modifyContent()