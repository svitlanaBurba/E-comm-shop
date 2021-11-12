import Handlebars from 'handlebars/runtime';
import { formatDate, formatPrice, formatPriceRange } from '../scripts/utils';

export const registerHandlebarsHelpers = () => {
  Handlebars.registerHelper('formatPrice', formatPrice);
  Handlebars.registerHelper('formatDate', formatDate);
  Handlebars.registerHelper('formatPriceRange', formatPriceRange);

  // this helper extends a bit native #if functionality
  // block helper will render it's internals only when first parameter equals to second
  // otherwise it will render what is after the {{else}}
  // {{#ifEquals stock 0}} Out of stock{{else}} some text for available qty{{/ifEquals}}
  Handlebars.registerHelper('ifEquals', function(arg1,arg2,options) {
    // if 1st parameter equals to 2nd then return what is between ifEquals and /ifEquals tags
    if (arg1=== arg2) return options.fn(this);
    return options.inverse(this);
  })
};
