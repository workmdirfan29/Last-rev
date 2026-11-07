import { defineLesson } from "@/data/lessons/author"

export default defineLesson("http", {
  slug: "https-and-tls",
  title: "HTTPS and TLS",
  topic: "HTTPS & TLS",
  minutes: 60,
  overview:
    "Understand what HTTPS adds to HTTP: encryption, integrity and server identity through TLS, certificates and certificate authorities, the handshake, and HSTS. Try a self-signed certificate locally.",
  objectives: [
    "Explain confidentiality, integrity and authentication",
    "Describe certificates, certificate authorities and the chain of trust",
    "Outline the TLS 1.3 handshake",
    "Explain HSTS and why certificate errors must not be ignored",
  ],
  prerequisites: ["lesson.http.headers"],
  sections: [
    {
      kind: "explain",
      heading: "Why HTTPS",
      body: [
        "Plain HTTP sends everything as readable text. Anyone on the network path (a shared Wi-Fi, a router) can read or change it. **HTTPS** is HTTP carried inside a **TLS** (Transport Layer Security) connection, usually on port 443. TLS provides three things: **confidentiality** (the data is encrypted), **integrity** (changes are detected) and **authentication** (the client can check that it is talking to the real server).",
        'TLS is the successor of SSL. The versions SSL and TLS 1.0 and 1.1 are obsolete; modern servers use TLS 1.2 and TLS 1.3. People still say "SSL certificate" out of habit.',
      ],
    },
    {
      kind: "explain",
      heading: "Certificates and trust",
      body: [
        'A **certificate** says: "this public key belongs to this domain name". It is signed by a **certificate authority (CA)**. Your operating system and browser ship with a list of CAs they trust. A server normally sends a **chain**: its own certificate, signed by an intermediate CA, which is signed by a root CA that the client already trusts.',
        "The client checks that the chain leads to a trusted root, that the certificate has not expired, that the domain name matches the *Subject Alternative Name* list and that it was not revoked. If any check fails, the browser shows a warning and `curl` stops with an error. Free certificates can be obtained automatically from Let's Encrypt, which uses the ACME protocol.",
      ],
    },
    {
      kind: "diagram",
      heading: "The TLS 1.3 handshake",
      diagram: {
        kind: "flow",
        title: "From TCP connection to encrypted data",
        steps: [
          {
            label: "ClientHello",
            detail:
              "The client sends supported TLS versions, cipher suites, a key share, the server name (SNI) and supported application protocols",
          },
          {
            label: "ServerHello",
            detail:
              "The server picks the parameters and sends its own key share; both sides can now derive shared secret keys",
          },
          {
            label: "Certificate and proof",
            detail:
              "The server sends its certificate chain and signs the handshake to prove it owns the private key (encrypted already)",
          },
          {
            label: "Finished",
            detail: "Both sides confirm the handshake was not tampered with",
          },
          {
            label: "Application data",
            detail:
              "HTTP requests and responses are sent, encrypted with fast symmetric keys",
          },
        ],
      },
    },
    {
      kind: "explain",
      heading: "Why it is secure",
      body: [
        "The handshake uses **ephemeral key exchange**: temporary keys are created for each connection, so recording traffic today and stealing the server's long-term key later does not reveal old sessions (**forward secrecy**). After the handshake the data is protected with a symmetric cipher, which is much faster than public-key cryptography. TLS 1.3 needs only one round trip to complete the handshake.",
      ],
    },
    {
      kind: "code",
      heading: "A self-signed certificate on your machine",
      example: {
        title: "curl accepts only a trusted certificate",
        language: "bash",
        code: 'openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 1 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost" 2>/dev/null\npython3 - 2>/dev/null <<\'PY\' &\nimport http.server, ssl\n\nclass Hello(http.server.BaseHTTPRequestHandler):\n    def do_GET(self):\n        body = b"secure hello"\n        self.send_response(200)\n        self.send_header("Content-Length", str(len(body)))\n        self.end_headers()\n        self.wfile.write(body)\n\nctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)\nctx.load_cert_chain("cert.pem", "key.pem")\nsrv = http.server.HTTPServer(("127.0.0.1", 8443), Hello)\nsrv.socket = ctx.wrap_socket(srv.socket, server_side=True)\nsrv.serve_forever()\nPY\nsrv=$!\nsleep 1\ncurl -s -o /dev/null -w "%{http_code}\\n" https://localhost:8443/; echo "exit=$?"\ncurl -s --cacert cert.pem https://localhost:8443/; echo\ncurl -s -k -o /dev/null -w "%{http_code}\\n" https://localhost:8443/\ncurl -sv --cacert cert.pem https://localhost:8443/ -o /dev/null 2>&1 | grep -E "SSL connection using|issuer:|subject:|certificate verify ok" | sed \'s/^\\* *//\' | sed \'s/ \\/ .*//\'\nkill $srv',
        walkthrough: [
          "`openssl req -x509 ...` creates a **self-signed** certificate for `localhost`: it vouches for itself, so no CA signed it. The Python snippet starts a tiny HTTPS server on port 8443 that uses it.",
          "The first `curl` fails: nothing is printed except the status `000` and the exit status is `60`, curl's code for a certificate problem (`SSL certificate problem: self-signed certificate`). The connection is refused because the certificate is not trusted.",
          "`--cacert cert.pem` tells curl to trust this one certificate, so the request works and prints `secure hello`.",
          "`-k` switches verification off and returns `200`, but then curl cannot tell a real server from an impostor. Never use it for real systems.",
          "The verbose output confirms `TLSv1.3` with a modern cipher and `certificate verify ok`; the subject and issuer are the same (`CN=localhost`) because the certificate is self-signed.",
        ],
      },
    },
    {
      kind: "explain",
      heading: "HSTS and mixed content",
      body: [
        "A server can send `Strict-Transport-Security: max-age=31536000; includeSubDomains` over HTTPS. This **HSTS** header tells the browser to use HTTPS only for that site for the given time, which blocks downgrade attacks. A page served over HTTPS that loads scripts or images over plain HTTP (**mixed content**) weakens the protection, and browsers block much of it.",
        "Redirect HTTP to HTTPS with a `301`, send HSTS, renew certificates before they expire and keep software up to date.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake:
            "Ignoring certificate warnings or using curl -k in production.",
          fix: "Fix the certificate; the warning means the server's identity is not proven.",
        },
        {
          mistake: "Letting a certificate expire.",
          fix: "Automate renewal and monitor expiry dates.",
        },
        {
          mistake: "Serving login pages over HTTP.",
          fix: "Use HTTPS everywhere, with a redirect from HTTP.",
        },
        {
          mistake: "Thinking HTTPS hides everything.",
          fix: "The server still sees your data and the domain name is visible to the network; HTTPS protects the content in transit.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Moving a site to HTTPS",
      scenario:
        "A small site still runs on plain HTTP and the browser shows 'Not secure'.",
      body: [
        "Obtain a certificate for the domain (for example with Let's Encrypt), install it on the web server, redirect port 80 to HTTPS with a 301, fix any mixed content and add the HSTS header once everything works.",
        "Test with `curl -I https://yourdomain` and a browser, and set a reminder or automation for renewal.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "tls-gives",
      prompt: "Which three guarantees does TLS provide?",
      options: [
        "Confidentiality, integrity and authentication",
        "Speed, caching and compression",
        "Logging, routing and load balancing",
      ],
      answer: 0,
      explanation:
        "Encryption, tamper detection and proof of the server's identity.",
    },
    {
      type: "single",
      id: "ca-role",
      prompt: "What does a certificate authority do?",
      options: [
        "Signs certificates to vouch that a key belongs to a domain",
        "Encrypts every web page",
        "Stores user passwords",
      ],
      answer: 0,
      explanation: "Clients trust the CA and so the certificates it signed.",
    },
    {
      type: "truefalse",
      id: "k-flag",
      statement: "curl -k makes a connection to an untrusted server safe.",
      answer: false,
      explanation:
        "It only turns verification off; you lose protection against impostors.",
    },
    {
      type: "blank",
      id: "https-port",
      prompt: "HTTPS uses TCP port ___ by default.",
      answer: "443",
      explanation: "HTTP uses 80 and HTTPS 443.",
    },
  ],
  assignment: {
    title: "Inspect and secure",
    task: [
      "Run the self-signed HTTPS demo locally. Show the three curl results (refused, trusted with --cacert, unverified with -k) and explain each.",
      "Use curl -v or openssl s_client against any public HTTPS site and list the TLS version, cipher, the certificate subject and who issued it.",
    ],
    checklist: [
      "I reproduced the certificate error and its exit status 60",
      "I explained the chain of trust",
      "I identified the TLS version in use",
      "I can explain HSTS in two sentences",
    ],
    hints: ["openssl s_client -connect host:443 -servername host"],
    minutes: 25,
  },
  exercises: [
    {
      slug: "tls-explain",
      title: "Explain the error",
      task: [
        "curl https://intranet.example prints 'SSL certificate problem: self-signed certificate'. Write three possible next steps in order of preference.",
      ],
      language: "markdown",
      starter: "1.\n2.\n3.",
      solution:
        "1. Install a certificate signed by a trusted CA (or an internal CA) on the server.\n2. Give the clients the internal CA or the certificate with --cacert (or the system trust store).\n3. Use -k only for a short local test, never in production.",
      hints: ["Prefer fixing the trust, not disabling the check."],
      checklist: [
        "A proper certificate is the first choice",
        "Trusting a specific CA is second",
        "-k is limited to short tests",
      ],
    },
  ],
  revisionNotes: [
    "HTTPS = HTTP over TLS (port 443): confidentiality, integrity, authentication",
    "Certificate chain: leaf, intermediate, root; checks for trust, dates and names",
    "TLS 1.3: ClientHello, ServerHello, certificate and proof, Finished, encrypted data; forward secrecy",
    "HSTS forces HTTPS; never ignore certificate errors",
  ],
  resources: [
    {
      label: "RFC 8446: TLS 1.3",
      url: "https://www.rfc-editor.org/rfc/rfc8446.html",
    },
    {
      label: "MDN: Transport Layer Security",
      url: "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security",
    },
    {
      label: "MDN: Strict-Transport-Security",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security",
    },
    {
      label: "Let's Encrypt: how it works",
      url: "https://letsencrypt.org/how-it-works/",
    },
  ],
})
