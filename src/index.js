import './styles/styles.scss';
import CountdownTimer from './scripts/timer';
import onCheckout1Load from './scripts/checkout1';
import onCheckout2Load from './scripts/checkout2';
import onMainLoad from './scripts/main';

const pathname = window.location.pathname;
console.log('pathname', pathname);

if (pathname === '/checkout2.html') {
  onCheckout2Load();
}

if (pathname === '/checkout1.html') {
  onCheckout1Load();
}

if (pathname === '/index.html' || pathname === '/') {
  onMainLoad();

  const timer = new CountdownTimer({
    selector: '#timer-1',
    targetDate: new Date('Oct 05, 2021')
  });
  timer.start();
}
