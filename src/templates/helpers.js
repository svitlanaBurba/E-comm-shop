import Handlebars from 'handlebars/runtime';
import { formatDate, formatPrice, formatPriceRange } from '../scripts/utils';

export const registerHandlebarsHelpers = () => {
  Handlebars.registerHelper('formatPrice', formatPrice);
  Handlebars.registerHelper('formatDate', formatDate);
  Handlebars.registerHelper('formatPriceRange', formatPriceRange);
};
