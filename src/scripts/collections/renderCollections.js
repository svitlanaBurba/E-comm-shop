
import collectionsTemplate from "../../templates/collectionsTemplate.hbs"


const renderCollections = (collections, element) => {
  element.innerHTML = collectionsTemplate(collections);
};

export default renderCollections;
