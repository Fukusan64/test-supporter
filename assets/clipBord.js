window.onload = () => {
  [...document.getElementsByTagName('button')].map(elem => {
    elem.addEventListener('click', () => {
      const val = elem.dataset.text;
      if(typeof navigator?.clipboard?.writeText === 'function') {
        navigator.clipboard.writeText(val).then(
          () => {
            const log = document.createElement('p');
            log.innerText = 'success';
            elem.parentElement.appendChild(log);
            setTimeout(() => {
              log.remove();
            }, 5000);
          }, () => {
            const log = document.createElement('p');
            log.innerText = 'error';
            elem.parentElement.appendChild(log);
            setTimeout(() => {
              log.remove();
            }, 5000);
          }
        );
      } else {
        try {
          const ta = document.createElement('textarea');
          ta.innerText = val;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();

          const log = document.createElement('p');
          log.innerText = 'success';
          elem.parentElement.appendChild(log);
          setTimeout(() => {
            log.remove();
          }, 5000);
        } catch(e) {
          const log = document.createElement('p');
          log.innerText = 'error';
          elem.parentElement.appendChild(log);
          setTimeout(() => {
            log.remove();
          }, 5000);
        }
      }

    });
  });
};
