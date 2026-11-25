#!/usr/bin/env python3
"""Refresh assets/data/github.json, the numbers behind the Software page.

The file holds what a visitor sees on the GitHub profile, read from the same
source GitHub uses to draw it (the contributionsCollection in its GraphQL API):

  - the contribution calendar for the last year
  - this month's activity: commits, the most-discussed pull request, the other
    pull requests opened, pull requests reviewed and issues opened
  - stars, forks, watchers, open issues and open pull requests for the packages
    on the Software page

Run it by hand with `python3 scripts/update_github_data.py`. It needs a GitHub
token, taken from GH_DATA_TOKEN, GITHUB_TOKEN or GH_TOKEN, or from the `gh`
command-line tool if you are signed in to it. The deploy workflow runs it on a
schedule, so the published site stays current without anyone doing this.

Only the Python standard library is used.
"""

import datetime
import json
import os
import pathlib
import subprocess
import sys
import urllib.error
import urllib.request
from zoneinfo import ZoneInfo

# --- Settings ----------------------------------------------------------------

USER = "jordandeklerk"

# Repositories whose GitHub description and numbers (stars, forks, watchers,
# open issues, open pull requests) appear on the Software page.
PACKAGES = [
    "arviz-devs/arviz-stats",
    "arviz-devs/arviz-plots",
    "arviz-devs/arviz-base",
    "arviz-devs/arviz",
    "arviz-devs/EABM",
    "jordandeklerk/moderndid",
    "jordandeklerk/mmmJAX",
]

# GitHub decides which month a contribution falls in using the viewer's time
# zone. This is the zone used here, so the numbers match your own view.
TIMEZONE = "America/New_York"

OUTPUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "data" / "github.json"

# --- GitHub API --------------------------------------------------------------

LEVELS = {"NONE": 0, "FIRST_QUARTILE": 1, "SECOND_QUARTILE": 2, "THIRD_QUARTILE": 3, "FOURTH_QUARTILE": 4}

CALENDAR_AND_PACKAGES = """
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
  %(packages)s
}
"""

PACKAGE = (
    '%(alias)s: repository(owner: "%(owner)s", name: "%(name)s") {'
    " description stargazerCount forkCount watchers { totalCount }"
    " issues(states: OPEN) { totalCount } pullRequests(states: OPEN) { totalCount } }"
)

MONTH = """
query($login: String!, $from: DateTime!, $to: DateTime!, $selfReviewed: String!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      commitContributionsByRepository(maxRepositories: 50) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
      totalPullRequestContributions
      pullRequestContributionsByRepository(maxRepositories: 50) {
        repository { nameWithOwner }
        contributions(first: 100) { totalCount nodes { pullRequest { number state } } }
      }
      pullRequestReviewContributionsByRepository(maxRepositories: 50) {
        repository { nameWithOwner }
        contributions(first: 100) { nodes { pullRequest { number } } }
      }
      totalIssueContributions
      issueContributionsByRepository(maxRepositories: 50) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
      popularPullRequestContribution {
        pullRequest {
          number title url bodyText state createdAt additions deletions
          comments { totalCount }
          repository { nameWithOwner }
        }
      }
    }
  }
  # The profile also counts pull requests of your own that you left a review
  # on (replying in a review thread does this). They are not in the collection
  # above, so they are looked up separately.
  selfReviewed: search(query: $selfReviewed, type: ISSUE, first: 50) {
    nodes {
      ... on PullRequest {
        number
        repository { nameWithOwner }
        reviews(author: "%(user)s", first: 100) { nodes { submittedAt } }
      }
    }
  }
}
"""


def find_token():
    for name in ("GH_DATA_TOKEN", "GITHUB_TOKEN", "GH_TOKEN"):
        if os.environ.get(name):
            return os.environ[name]
    try:
        return subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        sys.exit("No GitHub token found. Set GITHUB_TOKEN, or sign in with `gh auth login`.")


def graphql(token, query, variables):
    request = urllib.request.Request(
        "https://api.github.com/graphql",
        data=json.dumps({"query": query, "variables": variables}).encode(),
        headers={"Authorization": "bearer " + token, "Content-Type": "application/json", "User-Agent": "site-data-refresh"},
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as error:
        sys.exit("GitHub returned %s: %s" % (error.code, error.read().decode()[:300]))
    if payload.get("errors"):
        sys.exit("GitHub reported an error: %s" % json.dumps(payload["errors"])[:500])
    return payload["data"]


# --- Building the file -------------------------------------------------------


def month_window(now, months_back=0):
    """Start and end of a calendar month in TIMEZONE; the current month ends now."""
    first = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    for _ in range(months_back):
        first = (first - datetime.timedelta(days=1)).replace(day=1)
    if months_back == 0:
        return first, now
    following = (first + datetime.timedelta(days=32)).replace(day=1)
    return first, following - datetime.timedelta(seconds=1)


def excerpt(text, limit=170):
    text = " ".join(text.split())
    return text if len(text) <= limit else text[:limit].rsplit(" ", 1)[0] + "…"


def month_activity(token, start, end):
    """One month of activity, as the list of entries the profile shows."""
    query = MONTH % {"user": USER}
    data = graphql(token, query, {
        "login": USER,
        "from": start.isoformat(),
        "to": end.isoformat(),
        "selfReviewed": "is:pr author:%s reviewed-by:%s updated:>=%s" % (USER, USER, start.date().isoformat()),
    })
    collection = data["user"]["contributionsCollection"]
    entries = []

    # Commits
    commits = [
        {"name": group["repository"]["nameWithOwner"], "count": group["contributions"]["totalCount"]}
        for group in collection["commitContributionsByRepository"]
    ]
    if collection["totalCommitContributions"]:
        entries.append({"kind": "commits", "total": collection["totalCommitContributions"], "repos": commits})

    # The pull request that drew the most comments gets its own entry, and is
    # then left out of the count of "other" pull requests, as on the profile.
    popular = (collection["popularPullRequestContribution"] or {}).get("pullRequest")
    if popular and popular["comments"]["totalCount"] > 0:
        entries.append({
            "kind": "popular",
            "repo": popular["repository"]["nameWithOwner"],
            "number": popular["number"],
            "title": popular["title"],
            "url": popular["url"],
            "excerpt": excerpt(popular["bodyText"]),
            "state": popular["state"].lower(),
            "created": popular["createdAt"],
            "additions": popular["additions"],
            "deletions": popular["deletions"],
            "comments": popular["comments"]["totalCount"],
        })
    else:
        popular = None

    pulls = []
    for group in collection["pullRequestContributionsByRepository"]:
        name = group["repository"]["nameWithOwner"]
        nodes = [node["pullRequest"] for node in group["contributions"]["nodes"]]
        total = group["contributions"]["totalCount"]
        if popular and name == popular["repository"]["nameWithOwner"]:
            nodes = [pull for pull in nodes if pull["number"] != popular["number"]]
            total -= 1
        if total == 0:
            continue
        row = {"name": name, "count": total}
        if len(nodes) == total:  # states are only shown when every pull request was read
            for state in ("open", "merged", "closed"):
                row[state] = sum(1 for pull in nodes if pull["state"].lower() == state)
        pulls.append(row)
    other_total = collection["totalPullRequestContributions"] - (1 if popular else 0)
    if other_total > 0:
        entries.append({"kind": "pulls", "total": other_total, "other": bool(popular), "repos": pulls})

    # Reviews: distinct pull requests, including your own where you left a review.
    reviewed = {}
    for group in collection["pullRequestReviewContributionsByRepository"]:
        numbers = reviewed.setdefault(group["repository"]["nameWithOwner"], set())
        numbers.update(node["pullRequest"]["number"] for node in group["contributions"]["nodes"])
    for pull in data["selfReviewed"]["nodes"]:
        if not pull:
            continue
        times = [datetime.datetime.fromisoformat(r["submittedAt"].replace("Z", "+00:00")) for r in pull["reviews"]["nodes"] if r["submittedAt"]]
        if any(start <= when <= end for when in times):
            reviewed.setdefault(pull["repository"]["nameWithOwner"], set()).add(pull["number"])
    reviews = sorted(({"name": name, "count": len(numbers)} for name, numbers in reviewed.items()), key=lambda r: -r["count"])
    if reviews:
        entries.append({"kind": "reviews", "total": sum(r["count"] for r in reviews), "repos": reviews})

    # Issues
    issues = [
        {"name": group["repository"]["nameWithOwner"], "count": group["contributions"]["totalCount"]}
        for group in collection["issueContributionsByRepository"]
    ]
    if collection["totalIssueContributions"]:
        entries.append({"kind": "issues", "total": collection["totalIssueContributions"], "repos": issues})

    return entries


def main():
    token = find_token()
    now = datetime.datetime.now(ZoneInfo(TIMEZONE))

    packages = "\n  ".join(
        PACKAGE % {"alias": "package%d" % index, "owner": repo.split("/")[0], "name": repo.split("/")[1]}
        for index, repo in enumerate(PACKAGES)
    )
    data = graphql(token, CALENDAR_AND_PACKAGES % {"packages": packages}, {"login": USER})
    calendar = data["user"]["contributionsCollection"]["contributionCalendar"]

    # Use this month; in the first days of a month with nothing in it yet,
    # show the month before instead of an empty section.
    start, end = month_window(now)
    entries = month_activity(token, start, end)
    if not entries:
        start, end = month_window(now, months_back=1)
        entries = month_activity(token, start, end)

    result = {
        "generated": now.astimezone(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "user": USER,
        "calendar": {
            "total": calendar["totalContributions"],
            "days": [
                {"date": day["date"], "count": day["contributionCount"], "level": LEVELS[day["contributionLevel"]]}
                for week in calendar["weeks"]
                for day in week["contributionDays"]
            ],
        },
        "month": {"label": start.strftime("%B %Y"), "entries": entries},
        "packages": {
            repo: {
                "description": data["package%d" % index]["description"] or "",
                "stars": data["package%d" % index]["stargazerCount"],
                "forks": data["package%d" % index]["forkCount"],
                "watching": data["package%d" % index]["watchers"]["totalCount"],
                "issues": data["package%d" % index]["issues"]["totalCount"],
                "pulls": data["package%d" % index]["pullRequests"]["totalCount"],
            }
            for index, repo in enumerate(PACKAGES)
            if data.get("package%d" % index)
        },
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, indent=1, ensure_ascii=False) + "\n")
    summary = ", ".join("%s %s" % (entry["kind"], entry.get("total", "")) for entry in entries)
    print("Wrote %s: %s contributions in the last year; %s: %s" % (
        OUTPUT.relative_to(OUTPUT.parent.parent.parent), calendar["totalContributions"], result["month"]["label"], summary,
    ))


if __name__ == "__main__":
    main()
