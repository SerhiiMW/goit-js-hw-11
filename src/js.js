const refs = {
    form: document.querySelector(".js-search"),
    formContainer: document.querySelector(".js-form-container"),
    addBtn: document.querySelector(".js-add"),
    list: document.querySelector(".js-list"),
  };
  
  /*
  1. вішаємо слухач на кнопку для додавання поля
      1.1. додаємо розмітку нового інпуту
  2. вішаємо слухач на форму по події сабміт
      2.1. зупиняємо перезавантаження сторінки
      2.2. збираємо дані з форми в масив країн (та валідуємо їх)
      2.3. викликаємо функцію для запиту на сервер країн
      2.4 викликаємо функцію для запиту на сервер погоди
      2.5. показуємо розмітку прогнозу на основі відповіді від серверу викликаючи функцію яка створює розмітку
      2.6. робимо ресет для нашої форми
  3. описуємо фукнцію для запиту на столиці (+ додати фільтрацію якщо запит неуспішний, то він не попадає в масив результатів)
  4. опсисуємо функцію для запиту на погоду
  */
  
  refs.addBtn.addEventListener("click", handleAddField);
  refs.form.addEventListener("submit", handleSubmitCountries);
  
  function handleAddField() {
    refs.formContainer.insertAdjacentHTML(
      "beforeend",
      '<input type="text" name="country" />'
    );
  }
  
  async function handleSubmitCountries(event) {
    event.preventDefault();
  
    const formData = new FormData(event.currentTarget);
    const countries = formData
      .getAll("country")
      .map((value) => value.trim())
      .filter((value) => value);
  
    try {
      const capitals = await serviceCountries(countries);
      const weather = await serviceWeater(capitals);
  
      refs.list.innerHTML = createMarkup(weather);
    } catch (err) {
      console.log(err);
    } finally {
      event.target.reset();
      refs.formContainer.innerHTML = '<input type="text" name="country" />';
    }
  }
  
  async function serviceCountries(countries) {
    const resps = countries.map(async (country) => {
      const { data } = await axios.get(
        `https://restcountries.com/v3.1/name/${country}`
      );
      return data;
    });
  
    const results = await Promise.allSettled(resps);
  
    return results
      .filter(({ status }) => status === "fulfilled")
      .map(({ value }) => value[0].capital[0]);
  }
  
  async function serviceWeater(capitals) {
    const BASE_URL = "http://api.weatherapi.com/v1";
    const ENDPOINT = "forecast.json";
    const API_KEY = "66f9e81543404d02beb160521230808";
  
    const resps = capitals.map(async (capital) => {
      const { data } = await axios.get(
        `${BASE_URL}/${ENDPOINT}?key=${API_KEY}&q=${capital}&lang=uk`
      );
      return data;
    });
  
    const results = await Promise.allSettled(resps);
  
    return results
      .filter(({ status }) => status === "fulfilled")
      .map(({ value: { current, location } }) => {
        const {
          temp_c,
          condition: { text, icon },
        } = current;
        const { country, name } = location;
  
        return { temp_c, text, icon, country, name };
      });
  }
  
  function createMarkup(arr) {
    return arr
      .map(
        ({ temp_c, text, icon, country, name }) => `
          <li class="weather-card">
            <img src="${icon}" alt="${text}" class="weather-icon">
            <h2>${name}, ${country}</h2>
            <h3 class="weather-text">${text}</h3>
            <h3 class="temperature">${temp_c} °C</h3>
          </li>
          `
      )
      .join("");
  }