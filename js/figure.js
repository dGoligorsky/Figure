// when the page loads, we want to do two things:
// we want to get the file from Figma
// organize the file by ids
// then with those ids (as an array), generate some images from Figma
// then add them to the site

// loadFile().then(ids => {
//     loadImages(ids).then(imagesUrls => {
//         //in here add imageUrls (Which is an array) to the site
//     })
// })

const loadingTag = document.querySelector("header p.loading")

const apiKey = config.apiKey
// const apiKey = {{{{enter your Figma api key}}}}
const apiHeaders = {
    header: {
        "X-Figma-Token": apiKey
    }
}

const loadFile = function (key) {
    return fetch("https://api.figma.com/v1/files/" + key, apiHeaders)
    .then(response => response.json())
    .then(data => {
        // we want to return a list of frame ids
        const ids = data.document.children[0].children.map(frame => {
            return frame.id
        })


        return { 
            key: key,
            title: data.name, 
            ids: ids
        }
    })
}

const loadImages = function (obj) {
    console.log(ids)

    const key = obj.key
    const ids = obj.ids.join(",")

    return fetch("https://api.figma.com/v1/images/" + key + "?ids=" + ids + "&scale=0.25", apiHeaders)
        .then(response => response.json())
        .then(data => {
            return obj.ids.map(id => {
                return data.images[id]
            })
        })
}

const addImagesToSite = function (urls) {
    const sectionTag = document.querySelector("section")
    sectionTag.innerHTML = ""

    urls.forEach(url => {
        sectionTag.innerHTML = sectionTag.innerHTML + `
            <div>
                <img src="${url}">
            </div>
        `
    })
}

loadFile("CGOBm86xDuy1LrqlHANQcOEc")
    .then(file => {
        loadingTag.innerHTML = file.title
        document.title = file.title + " - Figure"
        return file
    })
    .then(file => loadImages(file))
    .then(imageUrls => addImagesToSite(imageUrls))
