#!/usr/bin/env python3
from __future__ import annotations

import http.server
import pathlib
import re
import shutil
import socketserver
import subprocess
import threading
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
REQUIRED = ["index.html", "styles.css", "app.js", "privacidade.html"]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


for name in REQUIRED:
    require((ROOT / name).is_file(), f"arquivo ausente: {name}")

index = (ROOT / "index.html").read_text(encoding="utf-8")
script = (ROOT / "app.js").read_text(encoding="utf-8")
require('lang="pt-BR"' in index, "idioma ausente")
require('id="lead-form"' in index, "formulario ausente")
require('name="consentimento" required' in index, "consentimento obrigatorio ausente")
require('href="privacidade.html"' in index, "link de privacidade ausente")
require('DEMONSTRACAO LOCAL' in index, "aviso de demonstracao ausente")
require('type="password"' not in index, "campo de senha proibido")

refs = re.findall(r'(?:href|src)="([^"#?]+)', index)
for ref in refs:
    if ref.startswith(("http://", "https://", "mailto:", "tel:")):
        continue
    require((ROOT / ref).is_file(), f"referencia local quebrada: {ref}")

secret_patterns = [r"AKIA[0-9A-Z]{16}", r"ghp_[A-Za-z0-9]{20,}", r"sk-[A-Za-z0-9]{20,}"]
all_text = "\n".join((ROOT / name).read_text(encoding="utf-8") for name in REQUIRED)
for pattern in secret_patterns:
    require(not re.search(pattern, all_text), f"possivel segredo: {pattern}")

node_path = shutil.which("node")
if node_path:
    node = subprocess.run([node_path, "--check", str(ROOT / "app.js")], capture_output=True, text=True)
    require(node.returncode == 0, f"JavaScript invalido: {node.stderr}")
else:
    require("addEventListener('submit'" in script, "handler de formulario ausente")
    require(script.count("{") == script.count("}"), "chaves JavaScript desequilibradas")
    require(script.count("(") == script.count(")"), "parenteses JavaScript desequilibrados")

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


handler = lambda *args, **kwargs: Quiet(*args, directory=str(ROOT), **kwargs)
with socketserver.TCPServer(("127.0.0.1", 0), handler) as server:
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    for route in ["/", "/styles.css", "/app.js", "/privacidade.html"]:
        with urllib.request.urlopen(base + route, timeout=5) as response:
            require(response.status == 200, f"HTTP {response.status}: {route}")
            require(len(response.read()) > 50, f"resposta vazia: {route}")
    server.shutdown()

print("PASS: MVP local, referencias, privacidade, JS e HTTP validados")
