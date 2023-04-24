
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