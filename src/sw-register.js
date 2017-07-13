function promptForRefresh() {
  let metas = document.head.getElementsByTagName('meta');

  for (let i = 0, len = metas.length; i < len; i++) {
    let meta = metas[i];

    if (meta.name === 'theme-color') {
      meta.content = '#000';
    }
  }

  let dom = document.createElement('div');

  /* eslint-disable max-len */
  dom.innerHTML = `
    <style>
      .app-refresh{background:#000;height:0;line-height:52px;overflow:hidden;position:fixed;top:0;left:0;right:0;z-index:10001;padding:0 18px;transition:all .3s ease;-webkit-transition:all .3s ease;-moz-transition:all .3s ease;-o-transition:all .3s ease;}
      .app-refresh-wrap{display:flex;color:#fff;font-size:15px;}
      .app-refresh-wrap label{flex:1;}
      .app-refresh-wrap span{cursor:pointer;}
      .app-refresh-show{height:52px;}
    </style>
    <div class="app-refresh" id="app-refresh">
      <div class="app-refresh-wrap" onclick="location.reload()">
        <label>已更新最新版本</label>
        <span>点击刷新</span>
      </div>
    </div>
  `;
  /* eslint-enable max-len */

  document.body.appendChild(dom);
  setTimeout(() => document.getElementById('app-refresh').className += ' app-refresh-show', 16);
}

if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      registration.onupdatefound = function() {
        if (navigator.serviceWorker.controller) {
          const installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                promptForRefresh();
                break;
              case 'redundant':
                throw new Error('The installing service worker became redundant.');
            }
          };
        }
      };
    }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
}
