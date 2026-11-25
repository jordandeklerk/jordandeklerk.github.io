// Everything on the Software page that comes from GitHub:
//   1. stars, forks, watchers, open issues and open pull requests beside each package
//   2. the contribution calendar
//   3. this month's activity, laid out like the timeline on a GitHub profile
//
// The numbers are read from /assets/data/github.json, which
// scripts/update_github_data.py writes from GitHub's own contribution data
// (the deploy workflow refreshes it on a schedule). Nothing here calls GitHub
// from the visitor's browser. If the file cannot be read, these parts of the
// page simply stay hidden.
//
// The icons are GitHub's Octicons (MIT licence, github.com/primer/octicons).

(() => {
  const DATA_URL = '/assets/data/github.json';
  const REPOS_TO_SHOW = 6; // repositories listed under each line of the timeline

  const ICONS = {
    star: ['M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z'],
    fork: ['M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z'],
    eye: ['M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z'],
    push: ['M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V1.5h-8a1 1 0 0 0-1 1v6.708A2.493 2.493 0 0 1 4.5 9h2.25a.75.75 0 0 1 0 1.5H4.5a1 1 0 0 0 0 2h4.75a.75.75 0 0 1 0 1.5H4.5A2.5 2.5 0 0 1 2 11.5Zm12.23 7.79h-.001l-1.224-1.224v6.184a.75.75 0 0 1-1.5 0V9.066L10.28 10.29a.75.75 0 0 1-1.06-1.061l2.505-2.504a.75.75 0 0 1 1.06 0L15.29 9.23a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018Z'],
    flame: ['M9.533.753V.752c.217 2.385 1.463 3.626 2.653 4.81C13.37 6.74 14.498 7.863 14.498 10c0 3.5-3 6-6.5 6S1.5 13.512 1.5 10c0-1.298.536-2.56 1.425-3.286.376-.308.862 0 1.035.454C4.46 8.487 5.581 8.419 6 8c.282-.282.341-.811-.003-1.5C4.34 3.187 7.035.75 8.77.146c.39-.137.726.194.763.607ZM7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.633a2.79 2.79 0 0 1-1.436-.874A3.198 3.198 0 0 0 3 10c0 2.53 2.164 4.5 4.998 4.5Z'],
    pull: ['M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z'],
    merged: ['M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z'],
    closed: ['M3.25 1A2.25 2.25 0 0 1 4 5.372v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.251 2.251 0 0 1 3.25 1Zm9.5 5.5a.75.75 0 0 1 .75.75v3.378a2.251 2.251 0 1 1-1.5 0V7.25a.75.75 0 0 1 .75-.75Zm-2.03-5.273a.75.75 0 0 1 1.06 0l.97.97.97-.97a.748.748 0 0 1 1.265.332.75.75 0 0 1-.205.729l-.97.97.97.97a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-.97-.97-.97.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l.97-.97-.97-.97a.75.75 0 0 1 0-1.06ZM2.5 3.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0ZM3.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm9.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z'],
    issue: ['M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z', 'M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z'],
  };

  // --- Helpers ---------------------------------------------------------------

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const link = (href, text, className) => {
    const node = el('a', className, text);
    node.href = href;
    return node;
  };

  const icon = (name) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    ICONS[name].forEach((d) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      svg.append(path);
    });
    return svg;
  };

  const number = new Intl.NumberFormat('en-US');
  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
  const utcDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const utcMonth = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
  const localDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  const localDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const count = (n, one, many) => `${number.format(n)} ${n === 1 ? one : many}`;
  const inRepos = (repos) => `in ${count(repos.length, 'repository', 'repositories')}`;

  // --- 1. Repository numbers beside each package -----------------------------
  // Stars, forks, watchers, open issues and open pull requests. Fills any
  // element with class "repo-stats" and data-repo="owner/name". A number that
  // is zero is left out, and the row is hidden if nothing is left.

  function drawPackages(packages) {
    document.querySelectorAll('.repo-stats[data-repo]').forEach((holder) => {
      const repo = holder.dataset.repo;
      const stats = packages[repo];
      if (!stats) return;
      [
        ['star', stats.stars, 'star', 'stars', 'stargazers'],
        ['fork', stats.forks, 'fork', 'forks', 'forks'],
        ['eye', stats.watching, 'watching', 'watching', 'watchers'],
        ['issue', stats.issues, 'open issue', 'open issues', 'issues'],
        ['pull', stats.pulls, 'open pull request', 'open pull requests', 'pulls'],
      ].forEach(([name, value, one, many, page]) => {
        if (!value) return;
        const item = link(`https://github.com/${repo}/${page}`);
        item.title = count(value, one, many);
        item.setAttribute('aria-label', item.title);
        item.append(icon(name), el('span', '', compact.format(value).toLowerCase()));
        holder.append(item);
      });
      holder.hidden = !holder.childNodes.length;
    });
  }

  // A repository's own GitHub description, shown word for word. The page
  // already carries the text; this replaces it if the repository's changes.
  function drawDescriptions(packages) {
    document.querySelectorAll('.repo-description[data-repo]').forEach((holder) => {
      const text = ((packages[holder.dataset.repo] || {}).description || '').trim();
      if (text) holder.textContent = /[.!?]$/.test(text) ? text : `${text}.`;
    });
  }

  // --- 2. Contribution calendar ----------------------------------------------
  // One column per week (Sunday at the top), one cell per day, shaded by the
  // 0-4 level GitHub assigns to each day.

  function drawCalendar(section, calendar) {
    const days = calendar.days;
    if (!Array.isArray(days) || days.length === 0) return;

    const figure = section.querySelector('.calendar');
    const grid = figure.querySelector('.calendar-grid');
    const scroller = figure.querySelector('.calendar-scroll');
    const tip = figure.querySelector('.calendar-tip');
    const cells = document.createDocumentFragment();
    const months = [];

    let week = 0;
    let lastMonth = -1;
    days.forEach((day, i) => {
      const date = new Date(`${day.date}T00:00:00Z`);
      const weekday = date.getUTCDay();
      if (i > 0 && weekday === 0) week += 1;

      if ((i === 0 || weekday === 0) && date.getUTCMonth() !== lastMonth) {
        lastMonth = date.getUTCMonth();
        months.push({ week, label: utcMonth.format(date) });
      }

      const cell = el('span', 'cell');
      cell.dataset.level = day.level;
      const amount = day.count === 0 ? 'No contributions' : count(day.count, 'contribution', 'contributions');
      cell.dataset.tip = `${amount} on ${utcDate.format(date)}`;
      cell.style.gridColumn = week + 2; // column 1 holds the weekday labels
      cell.style.gridRow = weekday + 2; // row 1 holds the month labels
      cells.append(cell);
    });

    const weeks = week + 1;
    grid.style.setProperty('--weeks', weeks);

    // Month labels span three week columns. Drop a label that would collide
    // with the next one or run off the right edge.
    months.forEach((month, i) => {
      const next = months[i + 1];
      if ((next && next.week - month.week < 3) || month.week > weeks - 3) return;
      const label = el('span', 'month', month.label);
      label.style.gridColumn = `${month.week + 2} / span 3`;
      grid.append(label);
    });

    [['Mon', 1], ['Wed', 3], ['Fri', 5]].forEach(([name, weekday]) => {
      const label = el('span', 'weekday', name);
      label.style.gridRow = weekday + 2;
      grid.append(label);
    });

    grid.append(cells);
    figure.querySelector('[data-total]').textContent = number.format(calendar.total);

    // Tooltip: follows the hovered day, kept inside the figure.
    grid.addEventListener('pointerover', (event) => {
      const cell = event.target.closest('.cell');
      if (!cell) return;
      tip.textContent = cell.dataset.tip;
      tip.hidden = false;
      const box = figure.getBoundingClientRect();
      const at = cell.getBoundingClientRect();
      const half = tip.offsetWidth / 2;
      const centre = at.left + at.width / 2 - box.left;
      tip.style.left = `${Math.min(Math.max(centre, half), box.width - half)}px`;
      tip.style.top = `${at.top - box.top}px`;
    });
    grid.addEventListener('pointerleave', () => { tip.hidden = true; });
    scroller.addEventListener('scroll', () => { tip.hidden = true; });

    figure.hidden = false;
    section.hidden = false;
    // On narrow screens the calendar scrolls sideways; start at the newest weeks.
    scroller.scrollLeft = scroller.scrollWidth;
  }

  // --- 3. This month's activity ----------------------------------------------
  // Each entry is one badge on the timeline. The wording follows GitHub's.

  function repoList(user, entry, style, hrefOf, noteOf) {
    const list = el('ul', `repos repos--${style}`);
    const largest = Math.max(...entry.repos.map((repo) => repo.count));

    entry.repos.slice(0, REPOS_TO_SHOW).forEach((repo) => {
      const row = el('li');
      const name = el('span', 'repo');
      name.append(link(hrefOf(repo.name), repo.name)); // names from GitHub are inserted as text only
      if (noteOf) name.append(el('span', 'note', noteOf(repo)));
      row.append(name);

      if (style === 'bars') {
        // Bar length is this repository's share of the busiest one.
        const bar = el('span', 'bar');
        const fill = el('span');
        fill.style.width = `${Math.max((repo.count / largest) * 100, 4)}%`;
        bar.append(fill);
        row.append(bar);
      }

      if (style === 'states') {
        const states = el('span', 'states');
        ['open', 'merged', 'closed'].forEach((state) => {
          if (!repo[state]) return;
          const tag = el('span', 'state');
          const amount = el('b', '', number.format(repo[state]));
          amount.dataset.state = state;
          tag.append(amount, document.createTextNode(` ${state}`));
          states.append(tag);
        });
        // States are missing only when a repository had too many pull requests to read.
        if (!states.childNodes.length) states.textContent = count(repo.count, 'pull request', 'pull requests');
        row.append(states);
      }

      list.append(row);
    });

    const more = entry.repos.length - REPOS_TO_SHOW;
    if (more > 0) list.append(el('li', 'more', `and ${count(more, 'more repository', 'more repositories')}`));
    return list;
  }

  // "Created a pull request in X that received N comments", with a card for
  // the pull request, as GitHub shows its most-discussed one.
  function popularEntry(entry) {
    const parts = [];
    const headline = el('p', 'headline');
    headline.append(
      'Created a pull request in ',
      link(`https://github.com/${entry.repo}`, entry.repo),
      ` that received ${count(entry.comments, 'comment', 'comments')}`,
    );
    const when = el('time', 'when', localDay.format(new Date(entry.created)));
    when.dateTime = entry.created;
    headline.append(when);
    parts.push(headline);

    const card = el('div', 'pull-card');
    const title = el('p', 'pull-title');
    const stateIcon = icon(entry.state === 'open' ? 'pull' : entry.state);
    stateIcon.setAttribute('class', `pull-state pull-state--${entry.state}`);
    title.append(stateIcon, link(entry.url, entry.title));
    card.append(title);
    if (entry.excerpt) card.append(el('p', 'pull-excerpt', entry.excerpt));

    // Five small blocks split between additions and deletions, as on GitHub.
    const meta = el('p', 'pull-meta');
    const changed = entry.additions + entry.deletions;
    const added = changed ? Math.round((entry.additions / changed) * 5) : 0;
    const diffstat = el('span', 'diffstat');
    for (let i = 0; i < 5; i += 1) diffstat.append(el('i', !changed ? '' : i < added ? 'plus' : 'minus'));
    meta.append(
      el('span', 'plus', `+${number.format(entry.additions)}`),
      el('span', 'minus', `−${number.format(entry.deletions)}`),
      diffstat,
      el('span', '', 'lines changed'),
      el('span', 'dot', '•'),
      el('span', '', count(entry.comments, 'comment', 'comments')),
    );
    card.append(meta);
    parts.push(card);
    return { icon: 'flame', parts };
  }

  function entryParts(user, entry) {
    const filter = (repo, query) => `https://github.com/${repo}/pulls?q=${encodeURIComponent(`is:pr ${query}`)}`;

    if (entry.kind === 'popular') return popularEntry(entry);

    if (entry.kind === 'commits') {
      return {
        icon: 'push',
        parts: [
          el('p', 'headline', `Created ${count(entry.total, 'commit', 'commits')} ${inRepos(entry.repos)}`),
          repoList(user, entry, 'bars', (repo) => `https://github.com/${repo}/commits?author=${user}`, (repo) => count(repo.count, 'commit', 'commits')),
        ],
      };
    }

    if (entry.kind === 'pulls') {
      const noun = entry.other ? ['other pull request', 'other pull requests'] : ['pull request', 'pull requests'];
      return {
        icon: 'pull',
        parts: [
          el('p', 'headline', `Opened ${count(entry.total, ...noun)} ${inRepos(entry.repos)}`),
          repoList(user, entry, 'states', (repo) => filter(repo, `author:${user}`)),
        ],
      };
    }

    if (entry.kind === 'reviews') {
      return {
        icon: 'eye',
        parts: [
          el('p', 'headline', `Reviewed ${count(entry.total, 'pull request', 'pull requests')} ${inRepos(entry.repos)}`),
          repoList(user, entry, 'notes', (repo) => filter(repo, `reviewed-by:${user}`), (repo) => count(repo.count, 'pull request', 'pull requests')),
        ],
      };
    }

    if (entry.kind === 'issues') {
      return {
        icon: 'issue',
        parts: [
          el('p', 'headline', `Opened ${count(entry.total, 'issue', 'issues')} ${inRepos(entry.repos)}`),
          repoList(user, entry, 'notes', (repo) => `https://github.com/${repo}/issues?q=${encodeURIComponent(`is:issue author:${user}`)}`, (repo) => count(repo.count, 'issue', 'issues')),
        ],
      };
    }

    return null;
  }

  function drawMonth(section, data) {
    const entries = (data.month.entries || []).map((entry) => entryParts(data.user, entry)).filter(Boolean);
    if (entries.length === 0) return;

    const wrapper = section.querySelector('.recent');
    const list = wrapper.querySelector('.timeline');

    // "November 2026", with the year quieter, as on GitHub.
    const [month, year] = data.month.label.split(' ');
    wrapper.querySelector('.period').append(month, ' ', el('span', '', year || ''));

    entries.forEach((entry) => {
      const item = el('li');
      const badge = el('span', 'timeline-badge');
      badge.append(icon(entry.icon));
      item.append(badge, ...entry.parts);
      list.append(item);
    });

    wrapper.querySelector('.as-of').textContent = `Updated ${localDate.format(new Date(data.generated))}`;
    wrapper.hidden = false;
    section.hidden = false;
  }

  // --- Load ------------------------------------------------------------------

  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`${response.status} from ${DATA_URL}`);
      return response.json();
    })
    .then((data) => {
      drawPackages(data.packages || {});
      drawDescriptions(data.packages || {});
      const section = document.getElementById('activity');
      if (!section) return;
      drawCalendar(section, data.calendar);
      drawMonth(section, data);
    })
    .catch(() => {});
})();
