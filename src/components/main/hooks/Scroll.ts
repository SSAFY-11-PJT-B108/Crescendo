import { EaseInOutQuad } from './EaseInOutQuad';

export const ScrollTo = (element: HTMLElement, to: number, duration: number) => {
  const start = element.scrollTop;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = () => {
    currentTime += increment;
    const val = EaseInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    } else {
      element.classList.remove('animated');
    }
  };

  animateScroll();
};
