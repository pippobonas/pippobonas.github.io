
async function Loadjson(url){
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

async function checkImageExists(url) {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
}

async function createImageElement(src, alt, cardElement) {
    if (await checkImageExists(src)) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        cardElement.appendChild(img);
    }
}

async function fillCardElements(card, repo) {
    const title= card.querySelector(".title");
    title.appendChild(document.createElement("h2")).textContent = repo.name;
    const desc = card.querySelector(".card-content p");
    desc.textContent = repo.description || "";
}


async function createImageLinkElement(href, imgSrc, imgAlt,cardElement) {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.className = "border-padding brd-rd-circle";

    const img = document.createElement("img");
    img.className = "button";
    img.src = imgSrc;
    img.alt = imgAlt;

    link.appendChild(img);
    cardElement.appendChild(link);
}

async function createTagElements(jsonPath, card) {
    await Loadjson(jsonPath)
    .then(data => {
        for (const [tag, count] of Object.entries(data)) {
            const ContainTag = document.createElement("div");
            ContainTag.className = "border-padding";
            const li = document.createElement("li");
            li.textContent = tag;
            ContainTag.appendChild(li);
            card.appendChild(ContainTag);
        }
    });
}


document.addEventListener("DOMContentLoaded", async function() {
    
    const projectsSection = document.getElementById("projects");

    await Loadjson('data/repo.json')
    .then(repos => {
        repos.forEach(repo => {

            if (repo.fork) return;

            const card = document.getElementById("templateProject").cloneNode(true);
            card.id = repo.name;

            fillCardElements(card, repo);

            const imgPath = "data/preview/" + repo.name + '.png';
            createImageElement(imgPath, repo.name + " preview", card.querySelector(".card-image"));

            const linkPath = repo.html_url;
            createImageLinkElement(linkPath, "icon/github.svg", "github", card.querySelector(".title"));

            const tagPath = 'data/tags/' + repo.name + '.json';
            createTagElements(tagPath, card.querySelector(".tags"));

            projectsSection.appendChild(card);
        });
    });
});