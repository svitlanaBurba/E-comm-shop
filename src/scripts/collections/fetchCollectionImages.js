//import collections from "./mockCollections.json"



const fetchCollectionImages = async () => {
    const url = "https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=wedding&page=1&per_page=12&key=21693687-d312e4baa20e789348b176d28"


    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = function () {
            console.log(this);

          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
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
  
export default fetchCollectionImages;
  
