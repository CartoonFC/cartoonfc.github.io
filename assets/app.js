/* Cartoon FC club site: renders every page from window.CFC (assets/data.js). */
(function () {
  const D = window.CFC;
  const M = D.match;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = (s) => String(s).toLowerCase().replace(/^@/, '').trim();
  const page = document.body.dataset.page;
  const POS = { GK: 'Goalkeepers', DEF: 'Defenders', MID: 'Midfielders', WING: 'Wingers', ST: 'Strikers', ANY: 'Any position' };
  const SRC = { YT: 'YouTube', IG: 'Instagram', TT: 'TikTok' };
  const fans = D.club.fans.youtube + D.club.fans.instagram + D.club.fans.tiktok;
  const P = M.players;
  const name = (i) => (P[i].team === 0 ? P[i].name : 'Virtus ' + P[i].short);
  const VIRTUS = '<svg class="crest" viewBox="0 0 100 115" aria-label="Virtus Valdorso crest"><path d="M50,4 C64,9 80,9 92,7 C93,52 84,86 50,109 C16,86 7,52 8,7 C20,9 36,9 50,4 Z" fill="#fff" stroke="#0e1530" stroke-width="4"/><path d="M50,4 C64,9 80,9 92,7 C93,52 84,86 50,109 Z" fill="#1f8a4c"/><path d="M50,4 C64,9 80,9 92,7 C93,52 84,86 50,109 C16,86 7,52 8,7 C20,9 36,9 50,4 Z" fill="none" stroke="#0e1530" stroke-width="4"/><rect x="14" y="44" width="72" height="20" rx="4" fill="#0e1530"/><text x="50" y="58.5" text-anchor="middle" font-family="Arial Black,Arial" font-size="12" fill="#fff">VIRTUS</text><text x="50" y="86" text-anchor="middle" font-family="Arial Black,Arial" font-size="11" fill="#0e1530">1971</text></svg>';
  const CFC = '<img class="crest" src="assets/logo.png" alt="Cartoon FC crest" width="74" height="74">';
  const rcol = (r) => (r >= 8 ? '#1f8a4c' : r >= 7 ? '#3aa35d' : r >= 6.5 ? '#c79a00' : r >= 6 ? '#e08a1e' : '#e5484d');
  const pl = (n, w) => (n ? n + ' ' + w + (n === 1 ? '' : 's') : '');
  const L = D.league;
  const club = (n) => L.clubs.find((c) => c.n === n);
  const crest = (c, size) => c.n === 'Cartoon FC' ? `<img src="assets/logo.png" alt="" width="${size}" height="${size}" style="border-radius:50%;flex:none">` : `<svg width="${size}" height="${Math.round(size * 1.15)}" viewBox="0 0 100 115" aria-hidden="true" style="flex:none"><path d="M50,4 C64,9 80,9 92,7 C93,52 84,86 50,109 C16,86 7,52 8,7 C20,9 36,9 50,4 Z" fill="${c.a}"/><path d="M50,4 C64,9 80,9 92,7 C93,52 84,86 50,109 Z" fill="${c.b}" opacity=".9"/><path d="M50,4 C64,9 80,9 92,7 C93,52 84,86 50,109 C16,86 7,52 8,7 C20,9 36,9 50,4 Z" fill="none" stroke="#0e1530" stroke-width="6"/><rect x="18" y="42" width="64" height="26" rx="6" fill="#0e1530"/><text x="50" y="62" text-anchor="middle" font-family="Arial Black,Arial" font-size="20" fill="#fff">${c.t}</text></svg>`;
  const ourG = (m) => m.games.find((g) => g.home === 'Cartoon FC' || g.away === 'Cartoon FC');
  const nextMd = L.matchdays.find((m) => { const g = ourG(m); return !L.results[`${m.md}:${g.home}-${g.away}`]; }) || L.matchdays[L.matchdays.length - 1];
  const nextG = ourG(nextMd);
  const table = () => {
    const T = Object.fromEntries(L.clubs.map((c) => [c.n, { n: c.n, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }]));
    Object.values(L.results).forEach((r) => { const h = T[r.home], a = T[r.away]; h.p++; a.p++; h.gf += r.hg; h.ga += r.ag; a.gf += r.ag; a.ga += r.hg; if (r.hg > r.ag) { h.w++; a.l++; h.pts += 3; } else if (r.hg < r.ag) { a.w++; h.l++; a.pts += 3; } else { h.d++; a.d++; h.pts++; a.pts++; } });
    return Object.values(T).sort((x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || x.n.localeCompare(y.n));
  };
  const yt = (id, t) => `https://www.youtube.com/watch?v=${id}${t ? '&t=' + t + 's' : ''}`;

  // nav state
  document.querySelectorAll('nav a').forEach((a) => { if (a.getAttribute('href') === page + '.html' || (page === 'index' && a.getAttribute('href') === 'index.html')) a.setAttribute('aria-current', 'page'); });
  document.querySelectorAll('[data-updated]').forEach((e) => (e.textContent = D.updated));

  const scoreboard = (actions) => `
    <section class="score" aria-label="Last match">
      <div class="meta">${esc(M.comp)} · ${esc(M.venue)} · ${esc(M.date)}</div>
      <div class="teams">
        <div class="team">${VIRTUS}<b>${esc(M.home)}</b></div>
        <div><div class="result num">${M.score[0]}<span style="opacity:.5">-</span>${M.score[1]}</div><small style="display:block;text-align:center;font:700 13px var(--body);color:var(--yellow);letter-spacing:.1em">FULL TIME</small></div>
        <div class="team">${CFC}<b>${esc(M.away)}</b></div>
      </div>
      <div class="scorers">⚽ ${M.scorers.map((s) => esc(s.name) + ' ' + s.min + "'").join(', ')} &nbsp;·&nbsp; 🧤 Riccardo ${P[0].saves} saves</div>
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </section>`;

  // latest league result on the home page (the match centre still shows the full friendly)
  const latestBoard = (R) => `
    <section class="score" aria-label="Last match">
      <div class="meta">${esc(R.comp)} · ${esc(R.venue)} · ${esc(R.date)}</div>
      <div class="teams">
        <div class="team">${crest(club(R.home), 64)}<b>${esc(R.home)}</b></div>
        <div><div class="result num">${R.score[0]}<span style="opacity:.5">-</span>${R.score[1]}</div><small style="display:block;text-align:center;font:700 13px var(--body);color:var(--yellow);letter-spacing:.1em">FULL TIME</small></div>
        <div class="team">${crest(club(R.away), 64)}<b>${esc(R.away)}</b></div>
      </div>
      <div class="scorers">⚽ ${R.scorers.map((s) => esc(s)).join(', ')} &nbsp;·&nbsp; 🧤 ${esc(R.saves)}</div>
      <div class="actions"><a class="btn" href="league.html">Table and fixtures</a>${R.video ? `<a class="btn ghost" href="${yt(R.video)}" target="_blank" rel="noopener">▶ Watch the highlights</a>` : ''}</div>
    </section>`;

  // ---------------------------------------------------------------- HOME
  if (page === 'index') {
    const act = `<a class="btn" href="match.html">Match centre</a>${M.video ? `<a class="btn ghost" href="${yt(M.video)}" target="_blank" rel="noopener">▶ Watch full match</a>` : ''}`;
    $('#app').innerHTML = `
      <div class="eyebrow">Latest result</div>
      ${D.latest ? latestBoard(D.latest) : scoreboard(act)}
      <div class="figs">
        <div class="fig"><div class="k">Bank</div><div class="v">€${D.club.bank}</div><div class="s">1 like = €1 · 100 views = €1</div></div>
        <div class="fig"><div class="k">Fans</div><div class="v">${fans}</div><div class="s">YouTube + Instagram + TikTok</div></div>
        <div class="fig"><div class="k">Squad</div><div class="v">${D.signed.length}/${D.club.squadMax}</div><div class="s">€${D.club.cost} per registration</div></div>
        <div class="fig"><div class="k">Waiting list</div><div class="v">${D.queue.length}</div><div class="s">want to play</div></div>
      </div>
      <div class="grid2">
        <section class="card"><div class="head"><h2>Latest news</h2></div>
          <div style="display:grid;gap:12px;margin-top:12px">${D.news.slice(0, 4).map((n) => `<a href="${n.link}" style="text-decoration:none;display:block;padding:12px;border:1px solid var(--line);border-radius:10px"><div class="eyebrow">${esc(n.date)}</div><h3 style="margin:4px 0">${esc(n.title)}</h3><div class="muted" style="font-size:14px">${esc(n.text)}</div></a>`).join('')}</div>
        </section>
        <section class="card"><div class="head"><h2>Next up</h2></div>
          <a href="league.html" style="display:block;text-decoration:none;margin-top:12px;padding:14px;border-radius:12px;background:var(--navy);color:#fff"><div class="eyebrow" style="color:#c9d1ea">Matchday ${nextMd.md} · ${esc(L.name)}</div><div style="display:flex;align-items:center;gap:10px;margin-top:8px;flex-wrap:wrap">${crest(club(nextG.home), 34)}<h3 style="font-size:24px;color:#fff">${esc(nextG.home)} - ${esc(nextG.away)}</h3>${crest(club(nextG.away), 34)}</div><div style="color:#c9d1ea;font-size:14px;margin-top:6px">${esc(club(nextG.home === 'Cartoon FC' ? nextG.away : nextG.home).story)}</div></a>
          <div style="margin-top:12px;padding:14px;border-radius:12px;border:2px solid var(--yellow2);background:#fff6d6"><div class="eyebrow">Open vote</div><h3 style="margin-top:6px">${esc(D.vote.q)}</h3><ol style="font-size:15px;margin:8px 0 0;padding-left:22px">${D.vote.opts.map((o) => `<li>${esc(o)}</li>`).join('')}</ol><div style="font-size:14px;margin-top:6px">${esc(D.vote.where)}.</div></div>
        </section>
      </div>
      <section class="card"><div class="head"><h2>The season so far</h2><a href="club.html">The full story →</a></div>
        <ul class="eps" style="margin-top:12px">${D.episodes.map((e) => `<li>${e.yt ? `<a href="https://www.youtube.com/shorts/${e.yt}" target="_blank" rel="noopener"><img class="th" src="https://i.ytimg.com/vi/${e.yt}/hqdefault.jpg" alt="${esc(e.day)} on YouTube" loading="lazy"></a>` : `<div class="th ph">${esc(e.day)}</div>`}<div><div class="d">${esc(e.day)} · ${esc(e.date)}</div><h3 style="margin:4px 0">${esc(e.title)}</h3><div class="muted" style="font-size:14px">${esc(e.text)}</div>${e.yt ? `<a href="https://www.youtube.com/shorts/${e.yt}" target="_blank" rel="noopener" style="font:700 13px var(--body);color:var(--blue)">Watch ${esc(e.day)} →</a>` : ''}</div></li>`).join('')}</ul>
      </section>`;
  }

  // ---------------------------------------------------------------- MATCH CENTRE
  if (page === 'match') {
    const tabs = ['summary', 'highlights', 'lineups', 'stats', 'ratings', 'fans'];
    const label = { summary: 'Summary', highlights: 'Highlights', lineups: 'Line-ups', stats: 'Stats', ratings: 'Player ratings', fans: 'Fans' };
    const evs = M.events.filter((e) => e.type !== 'corner' || true);
    const icon = (e) => (e.result === 'goal' ? '⚽' : e.type === 'corner' ? '🚩' : e.type === 'clear' ? '🛡️' : e.type === 'header' ? '🗣️' : e.result === 'save' ? '🧤' : '🎯');
    const evText = (e) => {
      if (e.type === 'corner') return [`Corner ${e.team === 1 ? 'Virtus Valdorso' : 'Cartoon FC'}`, 'Set piece'];
      if (e.type === 'clear') return [`${esc(name(e.who))} clears`, 'Header from the corner'];
      if (e.result === 'goal') return [`GOAL · ${esc(name(e.who))}`, `${M.home} take the lead`];
      if (e.result === 'save') return [`${esc(name(e.who))} shoots`, `Saved by ${e.sv === 0 ? 'Riccardo' : 'the Virtus keeper'}`];
      return [`${esc(name(e.who))} shoots`, 'Wide'];
    };
    const at = (min) => M.videoAt[min];
    const tl = () => {
      let html = '<ul class="tl">';
      let half = false;
      evs.forEach((e) => {
        if (!half && e.min > 45) { html += `<li class="div"><span>HALF TIME · 1 - 0</span></li>`; half = true; }
        const [t, s] = evText(e); const side = e.team === 1 ? 'home' : 'away';
        const v = at(e.min);
        const box = `<div class="ev"><div class="ico">${icon(e)}</div><div class="t"><b>${t}</b><span>${s}${v !== undefined ? `${s ? ' · ' : ''}<button class="watch" data-t="${v}">watch</button>` : ''}</span></div></div>`;
        html += `<li class="${side}${e.result === 'goal' ? ' goal' : ''}">${side === 'home' ? box : '<div></div>'}<div class="m">${e.min}'</div>${side === 'away' ? box : '<div></div>'}</li>`;
      });
      return html + `<li class="div"><span>FULL TIME · ${M.score[0]} - ${M.score[1]}</span></li></ul>`;
    };
    const statsHtml = (h) => {
      const st = M.stats.find((x) => String(x.half) === String(h));
      return `<div class="st">${st.rows.map(([lab, a, b, pa, pb]) => {
        const na = parseFloat(b), nb = parseFloat(a); const tot = (pa ?? na) + (pb ?? nb) || 1;
        const wa = ((pb ?? parseFloat(b)) / tot) * 100, wb = ((pa ?? parseFloat(a)) / tot) * 100;
        return `<div class="row"><div class="lab">${esc(lab)}</div><div class="a">${esc(b)}</div><div class="bars"><i><b style="width:${wa}%"></b></i><i><b style="width:${wb}%"></b></i></div><div class="b">${esc(a)}</div></div>`;
      }).join('')}</div>`;
    };
    const pitch = () => {
      const W = 680, H = 440, px = (x) => 20 + (x / 105) * (W - 40), py = (y) => 20 + (y / 68) * (H - 40);
      let s = `<svg class="pitch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Average positions, first half"><rect width="${W}" height="${H}" fill="#3d9846"/>`;
      for (let i = 0; i < 10; i++) s += `<rect x="${20 + i * (W - 40) / 10}" y="20" width="${(W - 40) / 10}" height="${H - 40}" fill="${i % 2 ? '#358a40' : '#3d9846'}"/>`;
      s += `<g fill="none" stroke="#fff" stroke-width="2" opacity=".9"><rect x="20" y="20" width="${W - 40}" height="${H - 40}"/><line x1="${W / 2}" y1="20" x2="${W / 2}" y2="${H - 20}"/><circle cx="${W / 2}" cy="${H / 2}" r="${(9.15 / 105) * (W - 40)}"/><rect x="20" y="${py(13.84)}" width="${(16.5 / 105) * (W - 40)}" height="${py(54.16) - py(13.84)}"/><rect x="${W - 20 - (16.5 / 105) * (W - 40)}" y="${py(13.84)}" width="${(16.5 / 105) * (W - 40)}" height="${py(54.16) - py(13.84)}"/></g>`;
      M.avg.forEach(([x, y], i) => {
        const us = i < 11; const c = us ? (i === 0 ? '#2fb36b' : '#ffd23f') : (i === 11 ? '#f59e0b' : '#ffffff');
        s += `<g transform="translate(${px(x)},${py(y)})"><circle r="14" fill="${c}" stroke="#0e1530" stroke-width="2.5"/>${!us ? '<circle r="14" fill="none" stroke="#1f8a4c" stroke-width="4" stroke-dasharray="4 4"/>' : ''}<text y="5" text-anchor="middle" font-family="Barlow Condensed,Arial" font-weight="800" font-size="15" fill="#0e1530">${P[i].num}</text>${us ? `<text y="30" text-anchor="middle" font-family="Inter,Arial" font-weight="700" font-size="11" fill="#fff" stroke="#0e1530" stroke-width="3" paint-order="stroke">${esc(P[i].short)}</text>` : ''}</g>`;
      });
      return s + '</svg>';
    };
    const plist = (team) => `<ul class="plist">${P.filter((p) => p.team === team).map((p) => `<li><span class="n">${p.num}</span><span class="nm">${esc(team === 0 ? p.name : 'Virtus Valdorso ' + p.short)}${p.i === 0 ? ' <span class="chip c">C</span>' : ''}<small>${p.pos}</small></span><span class="rt" style="background:${rcol(p.rating)}">${p.rating.toFixed(1)}</span></li>`).join('')}</ul>`;
    const bench = D.signed.filter((s) => !s.xi);
    const ratings = () => {
      const best = P.slice().sort((a, b) => b.rating - a.rating)[0]; const ours = P.filter((p) => p.team === 0).sort((a, b) => b.rating - a.rating)[0];
      const row = (p) => `<li><span class="n">${p.num}</span><span class="nm">${esc(p.team === 0 ? p.name : 'Virtus ' + p.short)}<small>${p.pos} · ${[pl(p.saves, 'save'), pl(p.shots, 'shot'), pl(p.goals, 'goal'), pl(p.tackles, 'tackle'), pl(p.inter, 'interception'), pl(p.clears, 'clearance'), p.passes ? p.passesOk + '/' + p.passes + ' passes' : ''].filter(Boolean).join(' · ')}</small></span><span class="rt" style="background:${rcol(p.rating)}">${p.rating.toFixed(1)}</span></li>`;
      return `
        <div class="grid2">
          <div class="potm"><div class="ph">1</div><div><div class="eyebrow">Cartoon FC player of the match</div><h3 style="font-size:26px">${esc(ours.short)}</h3><div class="muted" style="font-size:13px">${esc(ours.name)} · ${ours.saves} saves · captain, voted by you</div></div><div class="big num">${ours.rating.toFixed(1)}</div></div>
          <div class="potm" style="background:linear-gradient(90deg,#e6f5ec,#fff);border-color:#1f8a4c"><div class="ph" style="background:#fff;color:#1f8a4c">${best.num}</div><div><div class="eyebrow">Best on the pitch</div><h3 style="font-size:26px">Virtus ${esc(best.short)}</h3><div class="muted" style="font-size:13px">${best.goals} goal · ${best.shots} shots</div></div><div class="big num">${best.rating.toFixed(1)}</div></div>
        </div>
        <div class="lineup" style="margin-top:16px"><div><h3>Cartoon FC</h3><ul class="plist" style="margin-top:8px">${P.filter((p) => p.team === 0).sort((a, b) => b.rating - a.rating).map(row).join('')}</ul></div><div><h3>Virtus Valdorso</h3><ul class="plist" style="margin-top:8px">${P.filter((p) => p.team === 1).sort((a, b) => b.rating - a.rating).map(row).join('')}</ul></div></div>
        <p class="muted" style="font-size:13px;margin-top:12px">Ratings come from what each player did in the match engine: shots, saves, tackles, interceptions, clearances and passes. Nobody picks them by hand.</p>`;
    };
    const momentsList = Object.keys(M.videoAt).map((m) => { const e = evs.find((q) => String(q.min) === m && q.type !== 'corner'); return { m, t: M.videoAt[m], e }; });
    const view = {
      summary: () => `<section class="card"><div class="head"><h2>Match timeline</h2><span class="muted" style="font-size:13px">Decided by a public seed: ${M.seed} (the likes on DAY 4)</span></div>${tl()}</section>`,
      highlights: () => `<section class="card"><div class="head"><h2>Highlights</h2>${M.video ? `<a href="${yt(M.video)}" target="_blank" rel="noopener">Open on YouTube →</a>` : ''}</div>
        <div class="video" id="video">${M.video ? `<iframe id="yt" src="https://www.youtube-nocookie.com/embed/${M.video}?rel=0" title="Cartoon FC vs Virtus Valdorso, full match" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>` : '<div class="soon"><div><b>Full match coming soon</b>The video will appear here as soon as it is public.</div></div>'}</div>
        <ul class="moments">${momentsList.map(({ m, t, e }) => `<li><button data-t="${t}"><span class="m">${m}'</span><span><b style="display:block;font-size:14px">${e ? evText(e)[0] : 'Key moment'}</b><span class="muted" style="font-size:12px">${e ? evText(e)[1] : ''}</span></span></button></li>`).join('')}</ul></section>`,
      lineups: () => `<section class="card"><div class="head"><h2>Line-ups</h2><span class="muted" style="font-size:13px">Average positions, first half · Cartoon FC 4-3-3 · Virtus 4-4-2</span></div>${pitch()}<div class="lineup" style="margin-top:16px"><div><h3>Cartoon FC</h3>${plist(0)}<div class="eyebrow" style="margin:14px 0 6px">Squad (not in the XI)</div><div class="muted" style="font-size:13px">${bench.map((b) => esc(b.name) + (b.new ? ' (new)' : '')).join(' · ')}</div></div><div><h3>Virtus Valdorso</h3>${plist(1)}<div class="eyebrow" style="margin:14px 0 6px">Coaches</div><div class="muted" style="font-size:13px">Cartoon FC: Leo · Referee: on the diagonal all match</div></div></div></section>`,
      stats: () => `<section class="card"><div class="head"><h2>Match stats</h2><div class="seg" role="group" aria-label="Period"><button aria-pressed="true" data-h="all">Match</button><button aria-pressed="false" data-h="0">1st half</button><button aria-pressed="false" data-h="1">2nd half</button></div></div><div style="display:flex;justify-content:space-between;margin-top:12px;font:800 16px var(--display);text-transform:uppercase"><span style="color:#1f8a4c">Virtus Valdorso</span><span style="color:var(--navy2)">Cartoon FC</span></div><div id="st">${statsHtml('all')}</div></section>`,
      ratings: () => `<section class="card"><div class="head"><h2>Player ratings</h2></div>${ratings()}</section>`,
      fans: () => `<section class="card"><div class="head"><h2>In the ground</h2></div><div class="grid2" style="margin-top:10px"><div><h3>The curva · ${D.ultras.members.length + 2} ultras</h3><p class="muted" style="font-size:14px">Founders: ${D.ultras.founders.join(' · ')}</p><div class="muted" style="font-size:13px">${D.ultras.members.map(esc).join(' · ')}</div></div><div><h3>In the stands · ${D.tickets.length} tickets</h3><div class="muted" style="font-size:13px;margin-top:8px">${D.tickets.map(esc).join(' · ')}</div></div></div></section>`,
    };
    const host = $('#app');
    host.innerHTML = `${scoreboard(M.video ? `<a class="btn" href="${yt(M.video)}" target="_blank" rel="noopener">▶ Watch full match</a>` : '')}<div class="tabs" role="tablist">${tabs.map((t) => `<a class="tab" role="tab" href="#${t}" data-tab="${t}">${label[t]}</a>`).join('')}</div><div id="view"></div>`;
    const show = () => {
      const t = tabs.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'summary';
      document.querySelectorAll('.tab').forEach((a) => a.setAttribute('aria-selected', String(a.dataset.tab === t)));
      $('#view').innerHTML = view[t]();
      document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => { document.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); $('#st').innerHTML = statsHtml(b.dataset.h); }));
      document.querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', () => {
        if (!M.video) { location.hash = 'highlights'; return; }
        if (!$('#yt')) { location.hash = 'highlights'; setTimeout(() => jump(b.dataset.t), 50); return; }
        jump(b.dataset.t);
      }));
    };
    const jump = (t) => { const f = $('#yt'); if (!f) return; f.src = `https://www.youtube-nocookie.com/embed/${M.video}?rel=0&autoplay=1&start=${t}`; $('#video').scrollIntoView({ block: 'center' }); };
    window.addEventListener('hashchange', show); show();
  }

  // ---------------------------------------------------------------- SQUAD
  if (page === 'squad') {
    const groups = ['GK', 'DEF', 'MID', 'WING', 'ST'];
    let filter = 'ALL', term = '';
    const draw = () => {
      const rows = D.queue.filter((q) => filter === 'ALL' || q.pos === filter);
      $('#q-count').textContent = rows.length + ' waiting';
      $('#queue').innerHTML = rows.map((q, i) => `<li class="${q === D.queue[0] ? 'next' : ''}${term.length > 1 && norm(q.name).includes(term) ? ' hit' : ''}" id="t${q.n}"><div class="no">#${q.n}</div><div class="bd">${esc(q.name)}<small>${q.pos === 'ANY' ? 'Any position' : POS[q.pos].replace(/s$/, '')} · ${SRC[q.src]}${q === D.queue[0] ? ' · next to sign' : ''}</small></div></li>`).join('');
    };
    $('#app').innerHTML = `
      <section class="card"><div class="head"><h2>Find your name</h2><span class="muted" style="font-size:13px">Updated <span data-updated>${esc(D.updated)}</span></span></div>
        <div class="search" style="margin-top:12px"><input id="q" type="search" placeholder="Your YouTube, Instagram or TikTok name" autocomplete="off" aria-label="Search your name"></div><div class="answer" id="answer" aria-live="polite"></div></section>
      <section class="card"><div class="head"><h2>First team · ${D.signed.length}/${D.club.squadMax}</h2><span class="muted" style="font-size:13px">Head coach: Leo · Captain: Riccardo</span></div>
        ${groups.map((g) => { const ps = D.signed.filter((s) => s.pos === g); return ps.length ? `<div class="group"><h3>${POS[g]}</h3><div class="people">${ps.map((s) => `<div class="person"><div class="av ${g === 'GK' ? 'gk' : ''}">${esc(String(s.name).replace('@', '')[0].toUpperCase())}</div><div class="nm">${esc(s.name)}<small>${s.captain ? '<span class="chip c">Captain</span> ' : ''}${s.xi ? '<span class="chip">XI</span> ' : ''}${s.new ? '<span class="chip new">New</span>' : ''}</small></div></div>`).join('')}</div></div>` : ''; }).join('')}
      </section>
      <section class="card"><div class="head"><h2>Waiting list</h2><span class="muted" id="q-count" style="font-size:13px"></span></div>
        <p class="muted" style="font-size:14px;margin:8px 0 0">In the order you applied. Every €${D.club.cost} in the bank registers the next player; Leo can call by position when the team needs one. Comment I'M IN + your position under our latest episode to get a number. Following us is never required.</p>
        <div class="filters" role="group" aria-label="Filter by position">${['ALL', 'GK', 'DEF', 'MID', 'WING', 'ST', 'ANY'].map((p) => `<button data-f="${p}" aria-pressed="${p === 'ALL'}">${p}</button>`).join('')}</div>
        <ul class="queue" id="queue"></ul></section>`;
    document.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { filter = b.dataset.f; document.querySelectorAll('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); draw(); }));
    $('#q').addEventListener('input', (e) => {
      term = norm(e.target.value); draw();
      const a = $('#answer'); if (term.length < 2) { a.innerHTML = ''; return; }
      const s = D.signed.find((x) => norm(x.name).includes(term)); const q = D.queue.find((x) => norm(x.name).includes(term));
      if (s) a.innerHTML = `<div class="box"><b>${esc(s.name)} is in the first team${s.captain ? ' and wears the armband' : ''}.</b> ${s.new ? 'Signed on 13 Nov.' : ''}</div>`;
      else if (q) { const ahead = D.queue.indexOf(q); const need = Math.max(0, (ahead + 1) * D.club.cost - D.club.bank); a.innerHTML = `<div class="box"><b>${esc(q.name)}, you're #${q.n} on the waiting list.</b> ${ahead ? ahead + ' ahead of you · the bank needs about €' + need.toLocaleString('en') + ' more.' : 'You are next.'}</div>`; }
      else a.innerHTML = `<div class="box"><b>Not on the list yet.</b> Comment I'M IN + your position under our latest episode.</div>`;
    });
    draw();
  }

  // ---------------------------------------------------------------- LEAGUE
  if (page === 'league') {
    const rows = table();
    const res = (md, g) => L.results[`${md}:${g.home}-${g.away}`];
    $('#app').innerHTML = `
      <section class="score" style="text-align:center"><div class="eyebrow" style="color:#c9d1ea">Season 1</div><h1 style="font-size:40px;margin-top:6px">${esc(L.name)}</h1><p style="color:#c9d1ea;margin:8px auto 0;max-width:640px">${esc(L.format)}</p></section>
      <section class="card"><div class="head"><h2>Table</h2><span class="muted" style="font-size:13px">Every match is played by our match engine with a public seed</span></div>
        <div style="overflow-x:auto;margin-top:12px"><table class="lt"><thead><tr><th>#</th><th style="text-align:left">Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>
        ${rows.map((r, i) => `<tr class="${r.n === 'Cartoon FC' ? 'us' : ''} ${i === 0 ? 'up' : i < 3 ? 'po' : ''}"><td>${i + 1}</td><td><span class="cl">${crest(club(r.n), 26)}<b>${esc(r.n)}</b></span></td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf - r.ga}</td><td><b>${r.pts}</b></td></tr>`).join('')}
        </tbody></table></div>
        <p class="muted" style="font-size:13px;margin:10px 0 0"><span class="key up"></span> promotion &nbsp; <span class="key po"></span> play-off</p></section>
      <section class="card"><div class="head"><h2>Fixtures</h2><span class="muted" style="font-size:13px">Drawn with a public seed: ${L.seed} (${esc(L.seedSource)})</span></div>
        <div class="fx">${L.matchdays.map((m) => `<div class="md"><h3>Matchday ${m.md}</h3>${m.games.map((g) => { const r = res(m.md, g); const us = g.home === 'Cartoon FC' || g.away === 'Cartoon FC'; return `<div class="g${us ? ' us' : ''}"><span class="h">${esc(g.home)} ${crest(club(g.home), 22)}</span><span class="sc">${r ? `${r.hg} - ${r.ag}` : 'vs'}</span><span class="a">${crest(club(g.away), 22)} ${esc(g.away)}</span></div>`; }).join('')}</div>`).join('')}</div>
        <p class="muted" style="font-size:13px;margin:12px 0 0">🏆 ${esc(L.cup)}</p></section>
      <section class="card"><div class="head"><h2>The clubs</h2></div>
        <div class="clubs">${L.clubs.map((c) => `<div class="person" style="align-items:flex-start">${crest(c, 44)}<div class="nm">${esc(c.n)}<small style="font-weight:500">${esc(c.story)}</small></div></div>`).join('')}</div></section>`;
  }

  // ---------------------------------------------------------------- CLUB
  if (page === 'club') {
    $('#app').innerHTML = `
      <section class="card"><div class="head"><h2>The club</h2></div>
        <div class="figs" style="margin-top:12px">
          <div class="fig"><div class="k">Founded</div><div class="v" style="font-size:26px">${esc(D.club.founded)}</div><div class="s">by the comments</div></div>
          <div class="fig"><div class="k">League</div><div class="v" style="font-size:26px">${esc(D.club.league)}</div><div class="s">${esc(D.club.country)} · 9th tier</div></div>
          <div class="fig"><div class="k">Coach</div><div class="v" style="font-size:26px">Leo</div><div class="s">won your vote 18-1</div></div>
          <div class="fig"><div class="k">Shirt sponsor</div><div class="v" style="font-size:26px">Pizzeria</div><div class="s">2-year deal · €300</div></div>
        </div></section>
      <section class="card"><div class="head"><h2>The story</h2></div>
        <ul class="eps" style="margin-top:12px">${D.episodes.map((e) => `<li>${e.yt ? `<a href="https://www.youtube.com/shorts/${e.yt}" target="_blank" rel="noopener"><img class="th" src="https://i.ytimg.com/vi/${e.yt}/hqdefault.jpg" alt="${esc(e.day)} on YouTube" loading="lazy"></a>` : `<div class="th ph">${esc(e.day)}</div>`}<div><div class="d">${esc(e.day)} · ${esc(e.date)}</div><h3 style="margin:4px 0">${esc(e.title)}</h3><div class="muted" style="font-size:14px">${esc(e.text)}</div></div></li>`).join('')}
          <li><div class="th ph" style="aspect-ratio:16/9;max-height:none">FULL<br>MATCH</div><div><div class="d">13 Nov</div><h3 style="margin:4px 0">Virtus Valdorso 1-0 Cartoon FC</h3><div class="muted" style="font-size:14px">The full match with commentary, the dressing room and the studio.</div><a href="match.html" style="font:700 13px var(--body);color:var(--blue)">Match centre →</a></div></li></ul></section>
      <div class="grid2">
        <section class="card"><div class="head"><h2>How it works</h2></div>
          <ul class="rules" style="margin-top:12px">
            <li><b>Every like = €1</b> for the club, every 100 views = €1. Likes on YouTube, Instagram and TikTok all count.</li>
            <li><b>You decide in the comments.</b> The most commented choice wins, summed across platforms; story polls count too.</li>
            <li><b>Every player costs €${D.club.cost}</b> (registration and sports medical). The bank decides how many we can sign: ${D.club.squadMax} places.</li>
            <li><b>Matches are 100% random.</b> Our match engine plays them; a public number (like the likes on an episode) decides the randomness. We never choose a result.</li>
            <li><b>No rewards for likes or follows.</b> A place in the squad comes from the waiting list, never from following us.</li>
          </ul></section>
        <section class="card"><div class="head"><h2>Staff</h2></div>
          <div class="people" style="margin-top:12px">${D.staff.map((s) => `<div class="person"><div class="av">${esc(s.name.replace('@', '')[0])}</div><div class="nm">${esc(s.name)}<small>${esc(s.role)} · ${esc(s.note)}</small></div></div>`).join('')}</div>
          <div class="eyebrow" style="margin:16px 0 8px">Applied for a staff job</div>
          <div class="people">${D.staffApplied.map((s) => `<div class="person"><div class="av" style="background:#8b93a3">${esc(s.name.replace('@', '')[0].toUpperCase())}</div><div class="nm">${esc(s.name)}<small>${esc(s.note)}</small></div></div>`).join('')}</div></section>
      </div>`;
  }

  // ---------------------------------------------------------------- FANS
  if (page === 'fans') {
    $('#app').innerHTML = `
      <section class="score" style="text-align:center"><div class="eyebrow" style="color:#c9d1ea">The curva</div><h1 style="font-size:46px;margin-top:6px">Ultras Cartoon FC</h1><p style="color:#c9d1ea;margin:8px 0 0">${D.ultras.members.length + 2} ultras · founded by ${D.ultras.founders.join(' & ')}</p></section>
      <section class="card"><div class="head"><h2>Leaders of the curva: ${esc(D.ultras.leaders)}</h2><span class="muted" style="font-size:13px">Your vote · comments under DAY 5</span></div>
        <div style="display:grid;gap:10px;margin-top:12px">${D.ultras.leaderVote.map(([n, v]) => `<div style="display:grid;grid-template-columns:150px 30px 1fr;align-items:center;gap:10px"><b>${esc(n)}</b><span class="num" style="font:800 20px var(--display)">${v}</span><i style="display:block;height:10px;border-radius:6px;background:#e3e7f1;overflow:hidden"><b style="display:block;height:100%;width:${(v / 3) * 100}%;background:var(--green)"></b></i></div>`).join('')}</div></section>
      <div class="grid2">
        <section class="card"><div class="head"><h2>The ultras</h2></div><div class="people" style="margin-top:12px">${[...D.ultras.founders.map((n) => ({ n, f: true })), ...D.ultras.members.map((n) => ({ n }))].map((u) => `<div class="person"><div class="av">${esc(u.n[0].toUpperCase())}</div><div class="nm">${esc(u.n)}<small>${u.f ? 'Founder' : 'Curva'}</small></div></div>`).join('')}</div></section>
        <section class="card"><div class="head"><h2>In the stands</h2></div><p class="muted" style="font-size:14px;margin:8px 0 12px">Fans with a ticket for our first match.</p><div class="people">${D.tickets.map((n) => `<div class="person"><div class="av tk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 7v10" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/></svg></div><div class="nm">${esc(n)}</div></div>`).join('')}</div></section>
      </div>
      <section class="card"><div class="head"><h2>Join</h2></div><ul class="rules" style="margin-top:12px"><li>Comment <b>ULTRAS</b> under our latest episode to join the curva.</li><li>Comment <b>TICKETS</b> for a seat with your name in the stands.</li><li>Comment <b>I'M IN</b> + your position to get a number on the waiting list.</li></ul></section>`;
  }
})();
