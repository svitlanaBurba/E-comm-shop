import rangeSlider from "./rangeSlider";
import rangeSliderTemplate from './../../templates/rangeSlider.hbs'


const initSlider = (container,sliderOptions) => {
    container.innerHTML = rangeSliderTemplate();

    new rangeSlider(
        document.querySelector('#range-slider'),
        sliderOptions.onChange,
        sliderOptions.values,
    );
}

export default initSlider;