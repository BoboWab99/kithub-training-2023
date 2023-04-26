
const resultContainer = document.getElementById('result')

_fetch('https://cat-fact.herokuapp.com/facts', displayResult)


/**
 * @param {Array} data array of facts
 */
function displayResult(data) {

   const list = document.createElement('ul')
   list.classList.add('fact-list')

   data.forEach(fact => {
      // console.log(fact.text)
      // console.log(fact.createdAt.slice(0, 10))

      const dateCreated = fact.createdAt.slice(0, 10)
      const userFirstLetter = fact.user.slice(0, 1)

      const liText = `
      <li class="fact-list-item">
         <div class="fact-user-profile">${userFirstLetter}</div>
         <div class="fact-content">
            ${fact.text}
            <div class="fact-metadata">
               <span class="fact-user">${fact.user}</span>
               <span class="fact-created-at">${dateCreated}</span>
            </div>
         </div>
      </li>`

      // const listItem = document.createElement('li')
      // listItem.innerHTML = fact.text
      // listItem.classList.add('fact-list-item')
      const listItem = htmlStringToElement(liText)
      list.appendChild(listItem)
   })

   resultContainer.appendChild(list)
}


/**
 * @param {String} html single element html string
 * @returns {Element}
 */
function htmlStringToElement(html) {
   const t = document.createElement('template')
   t.innerHTML = html.trim()
   return t.content.firstElementChild
}


// these two functions '_fetch' and '_fetch2' do the same thing
// just two different styles of writing promises!


/**
 * Fetch API helper function
 * @param {String} url target url
 * @param {Function} callback executed on success - takes in returned data param
 * @param {String} method HTTP request method
 * @param {String} data JSON string
 */
async function _fetch(url, callback, method = 'GET', data) {
   let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
   });

   if (method !== 'GET') {
      headers.set('X-CSRFToken', JSON.parse(data)['csrfmiddlewaretoken']);
   }

   fetch(url, {
      method: method,
      headers: headers,
      body: data
   })
   .then(response => {
      const result = response.json();
      const status_code = response.status;
      if (status_code != 200) {
         console.log('Error fetching');
         return false;
      }
      return result
   })
   .then(data => {
      console.log(data);
      callback(data)
   })
   .catch(error => {
      console.error('Error:', error);
   });
}


/**
 * Fetch API helper function
 * @param {String} url target url
 * @param {Function} callback executed on success - takes in returned data param
 * @param {String} method HTTP request method
 * @param {String} data JSON string
 */
async function _fetch2(url, callback, method = 'GET', data) {
   let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
   });

   if (method !== 'GET') {
      headers.set('X-CSRFToken', JSON.parse(data)['csrfmiddlewaretoken']);
   }

   try {
      const response = await fetch(url, {
         method: method,
         headers: headers,
         body: data
      })

      const status_code = response.status
      if (status_code != 200) {
         console.log('Error fetching');
         return
      }

      const json = await response.json()
      console.log(json);
      callback(json)

   } catch (error) {
      console.error('Error:', error)
   }
}