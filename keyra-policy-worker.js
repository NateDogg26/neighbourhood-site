// Serves Keyra's public pages from this repository's GitHub Pages deployment.
// The fixed path list deliberately prevents this Worker from becoming an open proxy.
export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const pathname = new URL(request.url).pathname;
    const upstreamPath = pathname === "/" ? "/keyra/"
      : pathname === "/privacy" || pathname === "/privacy/" ? "/keyra/privacy/"
      : null;
    if (!upstreamPath) return new Response("Not found", { status: 404 });

    const upstream = await fetch(`https://neighbourhood.nitratehub.xyz${upstreamPath}`);
    const headers = new Headers(upstream.headers);
    headers.delete("set-cookie");
    headers.set("X-Content-Type-Options", "nosniff");
    return new Response(request.method === "HEAD" ? null : upstream.body, {
      status: upstream.status,
      headers
    });
  }
};
