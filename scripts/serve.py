#!/usr/bin/env python3
"""Preview the site locally: python3 scripts/serve.py, then open http://localhost:4173

Unlike `python3 -m http.server`, this tells the browser not to keep copies of
the files, so an ordinary refresh always shows the latest edit.
"""

import functools
import http.server
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):  # keep the terminal quiet
        pass


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=str(ROOT))
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler) as server:
        print("Serving %s at http://localhost:%d (Ctrl+C to stop)" % (ROOT.name, PORT))
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
