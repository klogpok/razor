//import { initTask2 } from './task2';

// Task1

let sliderImages = document.querySelectorAll('.slide'),
  arrowRight = document.querySelector('#arrow-right'),
  arrowLeft = document.querySelector('#arrow-left'),
  current = 0;

// Clear all images
const reset = () => {
  sliderImages.forEach(sliderImage => toggleImageDisplay(sliderImage, 'none'));
};

// Init slider
const startTask1 = () => {
  reset();
  toggleImageDisplay(sliderImages[0], 'block');
  initTask2();
};

// Show prev
const slideLeft = () => {
  reset();
  toggleImageDisplay(sliderImages[current - 1], 'block');
  current--;
};

// Show next
const slideRight = () => {
  reset();
  toggleImageDisplay(sliderImages[current + 1], 'block');
  current++;
};

// Left arrow click
arrowLeft.addEventListener('click', () => {
  if (current === 0) {
    current = sliderImages.length;
  }
  slideLeft();
});

// Right arrow click
arrowRight.addEventListener('click', () => {
  if (current === sliderImages.length - 1) {
    current = -1;
  }
  slideRight();
});

// Toggle display
const toggleImageDisplay = (image, status) => {
  image.style.display = status === 'block' ? 'block' : 'none';
};

// Task2

const getFlags = data => {
  fetch('https://restcountries.eu/rest/v2/all')
    .then(response => response.json())
    .then(json => addFlagToCountries(json, data));
};

const addFlagToCountries = (flags, countries) => {
  countries.forEach(country => {
    let itemIndex = flags.findIndex(element => {
      return (
        element.name.includes(country.name) ||
        element.altSpellings.find(item => item === country.name)
      );
    });
    return (country.flag = flags[itemIndex].flag);
  });

  showTask2(countries);
};

// Create DOM element
const createElement = (type, className = '', value = '') => {
  let element = document.createElement(type);
  element.className = className;
  element.innerHTML = value;
  return element;
};

// Add Task2 to DOM
const showTask2 = countries => {
  let countriesEl = document.querySelector('.countries');

  for (country of countries) {
    let cardDiv = createElement('div', 'card');
    let divFlag = createElement('div', 'flag');

    let flagImg = document.createElement('img');
    flagImg.setAttribute('src', country.flag);

    divFlag.appendChild(flagImg);
    cardDiv.appendChild(divFlag);
    cardDiv.appendChild(createElement('span', 'country_name', country.name));

    let ulEl = createElement('ul', 'cities');

    for (city of country.cities) {
      let li = createElement('li', '', city);
      ulEl.appendChild(li);
    }
    cardDiv.appendChild(ulEl);
    countriesEl.appendChild(cardDiv);
  }
};

const initTask2 = () => {
  fetch('http://northwind.servicestack.net/customers.json')
    .then(response => response.json())
    .then(json => initTask2Data(json.Customers));
};

const initTask2Data = data => {
  let countries = data.reduce((acc, curr) => {
    if (acc.length > 0) {
      if (!acc.some(item => item.name === curr.Country)) {
        let newItem = { name: curr.Country, cities: [] };
        newItem.cities.push(curr.City);
        acc.push(newItem);
        return acc;
      } else {
        let itemIndex = acc.findIndex(element => element.name === curr.Country);

        if (!acc[itemIndex].cities.some(city => city === curr.City)) {
          acc[itemIndex].cities.push(curr.City);
        }
        return acc;
      }
    }

    let newItem = { name: curr.Country, cities: [] };
    newItem.cities.push(curr.City);
    acc.push(newItem);
    return acc;
  }, []);

  const compareCountries = (a, b) => {
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    return x > y ? 1 : -1;
  };

  const compareCities = (a, b) => {
    let x = a.toLowerCase();
    let y = b.toLowerCase();
    return x > y ? 1 : -1;
  };

  countries.sort(compareCountries);
  countries.forEach(country => country.cities.sort(compareCities));

  getFlags(countries);
};

// const getTasks = () => {
//   fetch('home_assignment.json')
//     .then(response => response.json())
//     .then(json => console.log(json));
// };
// getTasks();

document.addEventListener('DOMContentLoaded', startTask1);
