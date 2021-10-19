const myFetch = async (url, transformer) => {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            
            if (typeof transformer === 'function') {
                resolve(transformer(xhr.response));
            } else {
                resolve(xhr.response);
            }
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
  
        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
  
        xhr.send();
      });
  };

  export default myFetch;