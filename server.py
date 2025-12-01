# serve.py
import webbrowser
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = 8000

if __name__ == "__main__":
    url = f"http://localhost:{PORT}"
    print(f"Serving on {url}")

    # Open a new browser tab
    webbrowser.open_new_tab(url)

    # Start server
    ThreadingHTTPServer(("0.0.0.0", PORT), SimpleHTTPRequestHandler).serve_forever()