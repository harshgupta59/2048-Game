document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  if (!grid) return;

  const upBtn = document.getElementById('up');
  const downBtn = document.getElementById('down');
  const leftBtn = document.getElementById('left');
  const rightBtn = document.getElementById('right');
  const resetBtn = document.getElementById('reset');

  // initialize data-prev on tiles for change detection
  const initTiles = () => {
    grid.querySelectorAll('div').forEach(tile => {
      tile.dataset.prev = (tile.textContent || '').trim();
    });
  };

  initTiles();

  // Observe the grid for text changes and animate updated tiles
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      let target = m.target;
      if (target.nodeType === 3) target = target.parentNode; // characterData -> parent node
      if (!target || !target.matches || !target.matches('.grid div')) return;

      const prev = target.dataset.prev || '';
      const curr = (target.textContent || '').trim();
      if (curr !== prev) {
        // animate when tile becomes non-zero or changes value
        if (curr !== '0' && curr !== '') {
          target.classList.add('pop');
          window.setTimeout(() => target.classList.remove('pop'), 220);
        }
        target.dataset.prev = curr;
      }
    });
  });

  observer.observe(grid, { childList: true, subtree: true, characterData: true });

  // button press visual feedback helpers
  const addActive = (el) => el && el.classList.add('active');
  const removeActive = (el) => el && el.classList.remove('active');

  // map keyCodes to buttons
  const keyMap = {
    37: leftBtn,
    38: upBtn,
    39: rightBtn,
    40: downBtn
  };

  document.addEventListener('keydown', (e) => {
    const btn = keyMap[e.keyCode];
    if (btn) addActive(btn);
  });
  document.addEventListener('keyup', (e) => {
    const btn = keyMap[e.keyCode];
    if (btn) removeActive(btn);
  });

  // mouse/touch interactions
  [upBtn, downBtn, leftBtn, rightBtn, resetBtn].forEach(b => {
    if (!b) return;
    b.addEventListener('mousedown', () => addActive(b));
    b.addEventListener('mouseup', () => removeActive(b));
    b.addEventListener('mouseleave', () => removeActive(b));
    b.addEventListener('touchstart', () => addActive(b), {passive:true});
    b.addEventListener('touchend', () => removeActive(b));
  });

  // Re-init tiles when reset is clicked (preserves game logic)
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // slight delay to let game logic reset DOM then re-sync
      setTimeout(initTiles, 100);
    });
  }

  // Expose a quick helper to realign tiles if grid changes
  const realign = () => initTiles();
  window.__gameUI = { realign };
});
