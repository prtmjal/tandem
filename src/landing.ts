// Landing page behaviour: the sample deck and the sticky "Start a game" bar. Kept tiny on purpose (no framework).
import './landing.css';

const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-card]'));
const end = document.getElementById('deck-end');
let i = 0;

// Pass and Next do the same thing here, exactly as in the game: move on, no questions asked.
function step() {
  if (i >= cards.length) return;
  cards[i].hidden = true;
  i++;
  if (i < cards.length) {
    const c = cards[i];
    c.hidden = false;
    c.classList.remove('in');
    void c.offsetWidth; // restart the flip animation
    c.classList.add('in');
  } else {
    // Loop back so the demo never dead-ends, and say where the rest of the deck lives.
    i = 0;
    cards[0].hidden = false;
    cards[0].classList.add('in');
    if (end) end.hidden = false;
  }
}
document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', step));

// Sticky bar appears only after the hero's button scrolls out of view.
const sticky = document.getElementById('sticky');
const hero = document.querySelector('.hero .btn');
const final = document.querySelector('.final');
if (sticky && hero && 'IntersectionObserver' in window) {
  let heroGone = false, finalSeen = false;
  const sync = () => {
    const on = heroGone && !finalSeen;
    sticky.classList.toggle('on', on);
    sticky.setAttribute('aria-hidden', String(!on));
    sticky.querySelector('a')?.setAttribute('tabindex', on ? '0' : '-1');
  };
  new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); }).observe(hero);
  if (final) new IntersectionObserver(([e]) => { finalSeen = e.isIntersecting; sync(); }).observe(final);
}
