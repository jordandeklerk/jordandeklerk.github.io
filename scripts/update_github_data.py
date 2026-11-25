#!/usr/bin/env python3
"""Refresh assets/data/github.json, the numbers behind the Software page.

The file holds two things, read from GitHub's GraphQL API:

  - the contribution calendar for the last year, the same one a visitor sees
    on the GitHub profile
  - the description, stars, forks, watchers, open issues and open pull
    requests for the packages on the Software page

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


def main():
    token = find_token()

    packages = "\n  ".join(
        PACKAGE % {"alias": "package%d" % index, "owner": repo.split("/")[0], "name": repo.split("/")[1]}
        for index, repo in enumerate(PACKAGES)
    )
    data = graphql(token, CALENDAR_AND_PACKAGES % {"packages": packages}, {"login": USER})
    calendar = data["user"]["contributionsCollection"]["contributionCalendar"]

    result = {
        "generated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "user": USER,
        "calendar": {
            "total": calendar["totalContributions"],
            "days": [
                {"date": day["date"], "count": day["contributionCount"], "level": LEVELS[day["contributionLevel"]]}
                for week in calendar["weeks"]
                for day in week["contributionDays"]
            ],
        },
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
    print("Wrote %s: %s contributions in the last year; %s packages" % (
        OUTPUT.relative_to(OUTPUT.parent.parent.parent), calendar["totalContributions"], len(result["packages"]),
    ))


if __name__ == "__main__":
    main()
