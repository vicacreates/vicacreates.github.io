/* Interatividade dos gráficos: linha-guia e balão por dia (gráfico diário) e balão nas barras (idade).
   Sem bibliotecas. Sem este arquivo a página continua completa, só sem o balão. */
(function () {
  var nf = function (n) { return Number(n).toLocaleString('pt-BR'); };

  function makeTip(host) {
    host.style.position = 'relative';
    var t = document.createElement('div');
    t.className = 'rp-tip';
    t.hidden = true;
    host.appendChild(t);
    return {
      show: function (text, clientX, clientY) {
        var hb = host.getBoundingClientRect();
        t.textContent = text;
        t.hidden = false;
        var x = clientX - hb.left + 12, y = clientY - hb.top - 34;
        x = Math.max(2, Math.min(hb.width - t.offsetWidth - 2, x));
        t.style.left = x + 'px';
        t.style.top = Math.max(2, y) + 'px';
      },
      hide: function () { t.hidden = true; }
    };
  }

  /* Gráfico diário: Instagram x TikTok */
  var dayHost = document.getElementById('grafico-diario');
  if (dayHost && dayHost.dataset.rows) {
    var svg = dayHost.querySelector('svg');
    var rows = JSON.parse(dayHost.dataset.rows);
    var NS = 'http://www.w3.org/2000/svg';
    var L = 46, R = 16, W = 760;
    svg.querySelectorAll('title').forEach(function (n) { n.remove(); }); // usa o balão próprio
    var guide = document.createElementNS(NS, 'line');
    guide.setAttribute('y1', 22);
    guide.setAttribute('y2', 290);
    guide.setAttribute('stroke', '#555');
    guide.setAttribute('stroke-dasharray', '3 3');
    guide.setAttribute('pointer-events', 'none');
    guide.style.display = 'none';
    svg.appendChild(guide);
    var dots = svg.querySelectorAll('circle[data-d]');
    var tip = makeTip(dayHost);
    svg.style.touchAction = 'pan-y';

    var move = function (e) {
      var bb = svg.getBoundingClientRect();
      var px = (e.clientX - bb.left) / bb.width * W;
      var d = Math.max(1, Math.min(31, Math.round(1 + (px - L) / (W - L - R) * 30)));
      var r = rows[d - 1];
      if (!r) return;
      var gx = L + (d - 1) * (W - L - R) / 30;
      guide.setAttribute('x1', gx);
      guide.setAttribute('x2', gx);
      guide.style.display = '';
      dots.forEach(function (c) { c.setAttribute('r', Number(c.dataset.d) === d ? 4.6 : 2.6); });
      tip.show(d + '/10 · Instagram ' + nf(r.ig) + ' · TikTok ' + nf(r.tt) + ' views', e.clientX, e.clientY);
    };
    var leave = function () {
      guide.style.display = 'none';
      dots.forEach(function (c) { c.setAttribute('r', 2.6); });
      tip.hide();
    };
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', leave);
  }

  /* Gráfico de idade: balão em cada barra */
  var ageHost = document.getElementById('grafico-idade');
  if (ageHost) {
    var ageTip = makeTip(ageHost);
    ageHost.querySelectorAll('svg rect').forEach(function (bar) {
      var title = bar.querySelector('title');
      var text = title ? title.textContent : '';
      if (title) title.remove();
      var show = function (e) { if (text) ageTip.show(text, e.clientX, e.clientY); };
      bar.addEventListener('pointermove', show);
      bar.addEventListener('pointerdown', show);
      bar.addEventListener('pointerleave', function () { ageTip.hide(); });
    });
  }
})();
