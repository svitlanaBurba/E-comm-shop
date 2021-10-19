import rangeSlider from "./rangeSlider";
import rangeSliderTemplate from './../../templates/rangeSlider.hbs'


const initSlider = (container,sliderValues,onChange) => {
    container.innerHTML = rangeSliderTemplate();

    new rangeSlider(
        document.querySelector('#range-slider'),
        onChange,
        sliderValues,
    );
}

export default initSlider;