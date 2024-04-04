const apiKey = "6N1Wn7J4teUTd1SHvOwinNk2HJQfsril7XmgcGrGKzclyJmHnkcByHWQ";
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");
const perPage = 15;
let currentPage = 1;

// api key, paginations, searchTerm, varibels 
let searchTerm = null;

const downloadImg = (imgUrl) => {
    // converting received img to blob , creating its download link, & downloading it
   fetch(imgUrl).then(res => res.blob()).then(file => {
       const a = document.createElement("a");
       a.href = URL.createObjectURL(file);
       a.download = new Date().getTime();
       a.click();
   }).catch(() => alert("failed to download image!"));
}

const showlightbox = (name, img) => {
    // showing lightbox and setting img source, name
    lightBox.classList.add("show");
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    document.body.style.overflow = "hidden";
    downloadImgBtn.setAttribute("data-img", img);
}

const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    // making li of all fetched and adding them to the existing image wrapper
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showlightbox('${img.photographer}', '${img.src.large2x}')">

        <img src="${img.src.large2x}" alt="img">
        <div class="details">

            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>

            <button onclick = "downloadImg('${img.src.large2x}')">
               <i class="uil uil-import"></i>
            </button>

        </div>

    </li>`
    ).join("");
}


const getImages = (apiUrl) => {
    // Fetching images by api call with authorization header
    fetch(apiUrl, {
        headers: { Authorization: apiKey }
    }).then(response => response.json()).then(data => {
        generateHTML(data.photos);

        loadMoreBtn.innerText = "load-more..⤵️";
        // console.log(data);
    }).catch(() => alert("failed to load images!"));
}

const loadMoreImages = () => {
    currentPage++;// increment currentPage 1

    // if searchterm has some value then call api with serach term else call default api
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    getImages(apiUrl);
}


const loadSearchImages = (e) => {
    // if the search input is empty , set the search term to null and return from here
    if (e.target.value === "") return searchTerm = null;
    // if pressed key is enter, update the current page , search term & call the getImages
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);

    }
}



getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);


loadMoreBtn.addEventListener("click", function () {
    loadMoreBtn.innerText = "loading...🔃";
    loadMoreImages();
});

searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));