const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const search = document.getElementById('search');
const slideDuration = document.getElementById('duration');

let sliders = [];
const KEY =  '15674931-a9d714b6e9d654524df198e00&q';

//  images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  //  gallery 
  galleryHeader.style.display = 'flex';
  images.forEach(query => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${query.webformatURL}") src="${query.webformatURL}" alt="${query.tags}">`;
    gallery.appendChild(div)
  })
  toggleSpinner (false)
}

const getImages =  (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
    toggleSpinner (true)
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  // Extra Feature 
  let imgCount = document.getElementById("select-images").innerText;
  let selectImg = parseInt(imgCount);

  let item = sliders.indexOf(img);

  if (item === -1) {
    sliders.push(img);
    let totalImg = selectImg + 1;
    document.getElementById("select-images").innerText = totalImg;
  } 
  
  else {
    element.classList.remove('added')
    sliders.pop(img);

    let totalSelect = selectImg - 1;
    document.getElementById("select-images").innerText = totalSelect;

  }
}

document.getElementById("create-slider").addEventListener('click', () => {
  document.getElementById("select-images").innerText = 0;
  
})

// API Loader spring 
const toggleSpinner = (loading) => {
  const spinner = document.getElementById("loading");
  if (loading) {
    spinner.classList.remove("d-none")
  }
  else {
    spinner.classList.add("d-none")
  }
}
// API Loader Spring End

let timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';

  // hide image
  imagesArea.style.display = 'none';

  const duration = document.getElementById('duration').value || 1000;

  if (duration > 0) {
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
  }
  else {
    alert('Please enter Positive Value')
    document.getElementById("select-images").innerText = 0;
  }
  changeSlide(0)

  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value);
  sliders.length = 0;
})

// keyBoard button
document.getElementById('search').addEventListener("keypress", function (event) {
  if (event.key == 'Enter') {
    document.getElementById("search-btn").click()
  }
})

// KeyBoard button
document.getElementById('duration').addEventListener("keypress", function (event) {
  if (event.key == 'Enter') {
    document.getElementById("create-slider").click()
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})
