// Everything on the Software page that comes from GitHub:
//   1. stars, forks, watchers, open issues and open pull requests beside each package
//   2. the contribution calendar
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

  const ICONS = {
    star: ['M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z'],
    fork: ['M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z'],
    eye: ['M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z'],
    pull: ['M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z'],
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
  const count = (n, one, many) => `${number.format(n)} ${n === 1 ? one : many}`;

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
    })
    .catch(() => {});
})();
