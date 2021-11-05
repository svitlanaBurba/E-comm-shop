import {myFetch} from "./utils";
import { baseURL} from "./configURLs";



const fetchStoresByLocation = async (lat, lng, distance) => {
    const storesByLocation = `${baseURL}/stores?lat[$gt]=${lat}&lat[$lte]=${lat+distance}&lng[$gt]=${lng}&lng[$lte]=${lng+distance}&$limit=2000`;

    return myFetch(storesByLocation, transformRawStoresData);
};
  
const transformRawStoresData = (rawStoresData) => {
    if (!rawStoresData || !rawStoresData.data) return [];
  
    // addinging additional  properties if needed
    rawStoresData.data.forEach(store => { 
        store.location = { lat: store.lat, lng: store.lng },
            store.workHours = store.hours.split(";").map(dayHours => {
                const arr = dayHours.split(":");
                return {day: arr[0], hours: arr[1]}
            })
        
    });
  
    return rawStoresData.data;
  }
  
  
  
  export default fetchStoresByLocation;