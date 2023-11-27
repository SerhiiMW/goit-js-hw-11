import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.btn'),
  cards: document.querySelector('.img-cards'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const classes = {
  loadMoreHidden: 'hidden',
};

let page = 1;

refs.form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  refs.loadMoreBtn.classList.add(classes.loadMoreHidden);
  event.preventDefault();
  refs.gallery.innerHTML = '';
  let searchParam = refs.input.value;
  try {
    const imgArr = await serviceGetImg(searchParam);
    if (!imgArr.totalHits) {
      throw Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    let totalHits = imgArr.totalHits;
    Notify.info(`Hooray! We found ${totalHits} images.`);
    refs.gallery.innerHTML = createMarkup(imgArr.hits);
    refs.loadMoreBtn.classList.remove(classes.loadMoreHidden);
    refs.loadMoreBtn.addEventListener('click', handleLoadMore);
  } catch (err) {
    console.log(err);
  }
}

async function handleLoadMore() {
  refs.loadMoreBtn.disabled = true;
  page += 1;
  let searchParam = refs.input.value;
  try {
    const imgArr = await serviceGetImg(searchParam);
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(imgArr.hits));
    let galleryLength = 0;
    galleryLength = refs.gallery.childNodes.length;
    if (galleryLength >= imgArr.totalHits) {
      refs.loadMoreBtn.classList.add(classes.loadMoreHidden);
      refs.loadMoreBtn.removeEventListener('click', handleLoadMore);
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    refs.loadMoreBtn.disabled = false;
  } catch (err) {
    console.log(err);
  }
}


async function serviceGetImg(searchParam, page = 1) {
  const URL = 'https://pixabay.com/api/';
  const API_KEY = '40825042-d0f3996893bece4a81b491d71';
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchParam,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });
  const { data } = await axios.get(`${URL}?${params}`);
  return data;
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="gallery__item">
                        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>${likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b>${views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b>${comments}
                            </p>
                            <p class="info-item">
                                 <b>Downloads</b>${downloads}
                            </p>
                        </div>
                    </div>`
    )
    .join('');
}
