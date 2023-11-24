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

refs.loadMoreBtn.classList.remove(classes.loadMoreHidden);


// let totalHits = 0;
let page = 1;

async function handleLoadMore() {
  page += 1;
  const searchParam = refs.input.value;
  // refs.loadMoreBtn.disabled = true;
  // await serviceGetImg(searchParam, page)
  try {
      const imgArr = await serviceGetImg(searchParam, page);
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(imgArr));

      // if (data.page >= data.totalHits) {
        // refs.loadMoreBtn.classList.add(classes.loadMoreHidden);
        // refs.loadMoreBtn.removeEventListener('click', handleLoadMore);
        // Notify.failure(
        //   'Sorry, there are no images matching your search query. Please try again.'
        // )
        // return;
      // }
      // refs.loadMoreBtn.disabled = false;
    } catch (err) {
      console.log(err);
    }
}

refs.form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  const searchParam = refs.input.value;
  try {
    const imgArr = await serviceGetImg(searchParam);
    refs.gallery.innerHTML = createMarkup(imgArr);
    if (page < 100) {
      refs.loadMoreBtn.classList.remove(classes.loadMoreHidden);
      refs.loadMoreBtn.addEventListener('click', handleLoadMore);
    }
  } catch (err) {
    console.log(err);
  } 
  // finally {
  //   refs.form.reset();
  // }
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
  if (!data.totalHits) {
    throw Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  return data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return { webformatURL, tags, likes, views, comments, downloads, largeImageURL};
    }
  );
}

function createMarkup(arr) {
  return arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
