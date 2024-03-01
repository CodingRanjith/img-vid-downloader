const imagesWrapper = document.querySelector(".images")
const loadMoreBtn = document.querySelector(".load-more")
const searchInput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox")
const closeBtn = lightBox.querySelector(".uil-times")
const downloadImgBtn = lightBox.querySelector(".uil-import")

const apiKey = "1p9K61a7WpSukh1JFvWcAMVAKOMSitfWV1nuVfWnHp8iWNvgVXXErtua"
const perPage = 20;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    //converting img into blob, creating download link & downloading it
    fetch(imgURL).then(res => res.blob()).then(file =>{
        const a = document.createElement("a")
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime()
        a.click();
    }).catch(() => alert("Failed to download image!"))
}

const showLightBox = (name, img) => {
    // showing lightbox  & setting img source ,name and button attribute
    lightBox.querySelector("img").src =img;
    lightBox.querySelector("span").innerText =name;
    downloadImgBtn.setAttribute("data-img",img)
    lightBox.classList.add("show")
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show")
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    //making li of all fetched images and adding them to the existing image wraper
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick = "showLightBox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                     <button onClick = "downloadImg('${img.src.large2x}');event.stopPropogation();">
                        <i class="uil uil-import"></i>
                     </button>
                </div>
         </li>`
        ).join("");
}

const getImages = (apiURL) => {
    //fetching images by API with authorization header
    loadMoreBtn.innerText = "Loading..."
    loadMoreBtn.classList.add("disabled")
    fetch(apiURL,{
       headers: {Authorization: apiKey} 
    }).then(res => res.json()).then(data =>{
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More"
        loadMoreBtn.classList.remove("disabled")
    }).catch(() => alert("Failed to load images!..."))
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL =`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
    apiURL =searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}` : apiURL; 
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    if(e.target.value === "") return searchTerm = null;
    //if key is pressed it updates the current page
    if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`)
loadMoreBtn.addEventListener("click",loadMoreImages)
searchInput.addEventListener("keyup",loadSearchImages)
closeBtn.addEventListener("click",hideLightbox)
downloadImgBtn.addEventListener("click",(e) => downloadImg(e.target.dataset.img));



const API_KEY = "1p9K61a7WpSukh1JFvWcAMVAKOMSitfWV1nuVfWnHp8iWNvgVXXErtua";
const videosContainer = document.getElementById('videos-container');
//const searchInput = document.getElementById('search-input');
//const loadMoreBtn = document.querySelector(".load-more");
//let currentPage = 1;

const fetchVideos = (query = '') => {
    const endpoint = query
        ? `https://api.pexels.com/videos/search?query=${query}&page=${currentPage}&per_page=20`
        : `https://api.pexels.com/videos/popular?page=${currentPage}&per_page=20`;

    // Make the API request
    fetch(endpoint, {
        headers: {
            'Authorization': API_KEY,
        },
    })
        .then(response => response.json())
        .then(data => {
            // Parse the response
            const videos = data.videos || [];

            // Display information about each video
            videos.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.innerHTML = `
                    <h2>Video Name: ${video.name}</h2>
                    <video width="640" height="360" controls onclick="openVideoModal('${video.video_files[0].link}')">
                        <source src="${video.video_files[0].link}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <hr>
                `;
                videosContainer.appendChild(videoElement);
            });
        })
        .catch(error => console.error('Error fetching videos:', error));
};

// Fetch default popular videos when the page loads
fetchVideos();

// Handle search input
searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    currentPage = 1;
    videosContainer.innerHTML = ''; // Clear previous results
    fetchVideos(query);
});

const openVideoModal = (videoSrc) => {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'video-modal';

    const closeModalBtn = document.createElement('button');
    closeModalBtn.innerText = 'Close';
    closeModalBtn.addEventListener('click', () => {
        modalContainer.remove();
    });

    const videoElement = document.createElement('video');
    videoElement.src = videoSrc;
    videoElement.controls = true;

    modalContainer.appendChild(closeModalBtn);
    modalContainer.appendChild(videoElement);

    document.body.appendChild(modalContainer);
};


const loadMoreVideos = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/videos/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/videos/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    fetchVideos(apiURL);
};

loadMoreBtn.addEventListener("click", () => {
    loadMoreImages();
    loadMoreVideos();
});

// Other event listeners
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));

document.querySelector('.load-more').addEventListener('click', loadMoreContent);

function loadMoreContent() {
    const activeTab = document.querySelector('.nav-tabs .nav-item .active');
    
    if (activeTab) {
        const activeTabId = activeTab.id;

        if (activeTabId === 'images-tab') {
            // Load more images
            console.log('Loading more images...');
        } else if (activeTabId === 'videos-tab') {
            // Load more videos
            console.log('Loading more videos...');
        }
        // Add your logic to fetch and display more content here
    }
}
