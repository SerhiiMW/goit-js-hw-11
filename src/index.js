// import { Notify } from 'notiflix/build/notiflix-notify-aio';
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
  loadMoreHidden: 'load-more-hidden',
};

let page = 1;

refs.form.addEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  const searchParam = refs.input.value;
  imgSearchService(searchParam)
    .then(data => {
      const dataHits = data.hits;
    //   refs.gallery.innerHTML = createMarkup(dataHits);
      refs.gallery.innerHTML =
      dataHits.map(
          ({
            webformatURL,
            // largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) =>
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
              </div>`).join("")

    //   if (data.page < data.totalHits && data.page < 500) {
    //     refs.loadMoreBtn.classList.remove(classes.loadMoreHidden);
        refs.loadMoreBtn.addEventListener('click', handleLoadMore);
    //   }
    })
    .catch(err => console.error(err))
    .finally(() => refs.form.reset());
}


function handleLoadMore() {
    const searchParam = refs.input.value;
  page += 1;
  refs.loadMoreBtn.disabled = true;
  imgSearchService(searchParam, page)
    .then(data => {
        const dataHits = data.hits;
        refs.gallery.insertAdjacentHTML(
        'beforeend',
        dataHits.map(
          ({
            webformatURL,
            // largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) =>
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
              </div>`).join("")
      );

    //   if (data.page >= 500) {
    //     refs.loadMoreBtn.classList.add(classes.loadMoreHidden);
        refs.loadMoreBtn.removeEventListener('click', handleLoadMore);
    //     return;
    //   }

    //   refs.loadMoreBtn.disabled = false;
    })
    .catch(err => {
      console.log(err);
    });
}

function imgSearchService(searchParam, page = 1) {
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
  return axios.get(`${URL}?${params}`).then(({ data }) => data);
}

// function createMarkup(arr) {
//   arr
//     .map(
//       ({
//         webformatURL,
//         // largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) =>
//         `<div class="photo-card">
//             <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//             <div class="info">
//                 <p class="info-item">
//                     <b>Likes</b>${likes}
//                 </p>
//                 <p class="info-item">
//                     <b>Views</b>${views}
//                 </p>
//                 <p class="info-item">
//                     <b>Comments</b>${comments}
//                 </p>
//                 <p class="info-item">
//                      <b>Downloads</b>${downloads}
//                 </p>
//             </div>
//         </div>`
//     )
//     .join('');
// }

// function imgSearchService(searchParam) {
//     const URL = 'https://pixabay.com/api/';
//     const API_KEY = '40825042-d0f3996893bece4a81b491d71';
//     const params = new URLSearchParams({
//       key: API_KEY,
//       q: searchParam,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       // page: page,
//       per_page: 40,
//     });
//     return axios.get(`${URL}?${params}`).then(({ data }) => data);
//   }

// refs.form.addEventListener('submit', handleSubmit);

// let page = 1;

// function handleLoadMore() {
//   page += 1;
//   refs.loadMoreBtn.disabled = true;
//   imgSearchService(page)
//     .then(data => {
//         console.log(data.hits)
//       refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

//       if (data.page >= 500) {
//         refs.loadMoreBtn.classList.add(classes.loadMoreHidden);
//         refs.loadMoreBtn.removeEventListener('click', handleLoadMore);
//         return;
//       }

//       refs.loadMoreBtn.disabled = false;
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }

// function handleSubmit(event) {
//     event.preventDefault();
//     const searchParam = refs.input.value;
//     imgSearchService(searchParam)
//       .then(data => {
//         let objHits = [];
//         objHits = data.hits;
//         const webformatURL= objHits.map(objHits => objHits.webformatURL);
//         // const largeImageURL= objHits.map(objHits => objHits.largeImageURL);
//         const tags = objHits.map(objHits => objHits.tags);
//         const likes = objHits.map(objHits => objHits.likes);
//         const views = objHits.map(objHits => objHits.views);
//         const comments = objHits.map(objHits => objHits.comments);
//         const downloads = objHits.map(objHits => objHits.downloads);
//         // console.log(tags);
//               refs.gallery.innerHTML =
//             `<div class="photo-card">
//             <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//             <div class="info">
//                 <p class="info-item">
//                     <b>Likes </b>${likes}
//                 </p>
//                 <p class="info-item">
//                     <b>Views </b>${views}
//                 </p>
//                 <p class="info-item">
//                     <b>Comments </b>${comments}
//                 </p>
//                 <p class="info-item">
//                     <b>Downloads </b>${downloads}
//                 </p>
//             </div>
//         </div>`
//       })
//       .catch(err => console.error(err))
//       .finally(() => refs.form.reset());
//   }
//   createMarkup(objHits);

//   imgSearchService()
//   .then(data => {
//     // refs.gallery.innerHTML = ''
//     // const arr = data.hits;
//     refs.gallery.innerHTML = createMarkup(objHits);

//     // if (data.page < data.totalHits && data.page < 500) {
//     //   refs.loadMoreBtn.classList.remove(classes.loadMoreHidden);
//     //   refs.loadMoreBtn.addEventListener('click', handleLoadMore);
//     // }
//   })
//   .catch(err => {
//     console.log(err);
//   });

// function createMarkup (arr) {
//     // const objHits = data.hits;
//     // objHits.map(
//         arr.map(
//             ({
//                 webformatURL,
//                 // largeImageURL,
//                 tags,
//                 likes,
//                 views,
//                 comments,
//                 downloads,
//               }) =>
//             //   refs.gallery.innerHTML =
//             //   console.log(tags)
//                         `<div class="photo-card">
//                               <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//                               <div class="info">
//                                   <p class="info-item">
//                                       <b>Likes </b>${likes}
//                                   </p>
//                                   <p class="info-item">
//                                       <b>Views </b>${views}
//                                   </p>
//                                   <p class="info-item">
//                                       <b>Comments </b>${comments}
//                                   </p>
//                                   <p class="info-item">
//                                       <b>Downloads </b>${downloads}
//                                   </p>
//                               </div>
//                           </div>`
//                   )
//                   .join('');
// }

//   function imgSearchService (search) {
//   const imgSearch = async () => {
//     try {
//       const URL = 'https://pixabay.com/api/';
//       const API_KEY = '40825042-d0f3996893bece4a81b491d71';
//       const params = new URLSearchParams({
//         key: API_KEY,
//         q: search,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//       });
//       const response = await axios.get(`${URL}?${params}`);
//       const img = await response.json();
//       return img;
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   imgSearch().then(img => console.log(img));
//   }
