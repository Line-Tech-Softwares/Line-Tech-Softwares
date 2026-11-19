<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:output method="html" encoding="UTF-8" />

    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>XML Sitemap | Line Tech Softwares</title>
                <style>
                    :root{color-scheme:dark;--bg:#0b1118;--panel:#111b25;--line:#243544;--text:#edf5fb;--muted:#9aabba;--accent:#69c5ff;--green:#8ce2c0}
                    *{box-sizing:border-box}
                    body{margin:0;background:radial-gradient(ellipse at 10% 0%,#15304a 0,transparent 38%),var(--bg);color:var(--text);font:15px/1.6 "Segoe UI",Arial,sans-serif}
                    main{width:min(920px,calc(100% - 32px));margin:64px auto}
                    .hero{margin-bottom:28px}
                    .eyebrow{color:var(--green);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
                    h1{margin:8px 0;font-size:clamp(30px,5vw,46px);line-height:1.12;letter-spacing:-.04em}
                    .intro{max-width:620px;margin:12px 0 0;color:var(--muted)}
                    .summary{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0}
                    .summary-card{min-width:170px;padding:14px 18px;border:1px solid var(--line);border-radius:12px;background:rgba(17,27,37,.85)}
                    .summary-card strong{display:block;color:var(--accent);font-size:23px}
                    .summary-card span{color:var(--muted);font-size:13px}
                    .tree{display:grid;gap:16px}
                    .branch{padding:20px 22px 18px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(145deg,rgba(17,27,37,.96),rgba(12,19,27,.96));box-shadow:0 12px 36px rgba(0,0,0,.14)}
                    .branch h2{display:flex;align-items:center;gap:10px;margin:0 0 12px;font-size:18px}
                    .branch h2:before{width:9px;height:9px;border-radius:50%;background:var(--green);box-shadow:0 0 14px rgba(140,226,192,.45);content:""}
                    .branch ul{position:relative;display:grid;gap:2px;margin:0 0 0 4px;padding:0 0 0 22px;list-style:none}
                    .branch ul:before{position:absolute;top:0;bottom:15px;left:4px;border-left:1px solid var(--line);content:""}
                    .branch li{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;padding:9px 0}
                    .branch li:before{position:absolute;top:22px;left:-18px;width:13px;border-top:1px solid var(--line);content:""}
                    .branch li:last-child:after{position:absolute;top:23px;bottom:-2px;left:-19px;width:3px;background:var(--panel);content:""}
                    .page{display:grid;gap:1px;min-width:0;color:var(--text);text-decoration:none}
                    .page:hover .page-title,.page:focus-visible .page-title{color:var(--accent)}
                    .page-title{font-weight:650;transition:color .15s ease}
                    .page-url{overflow:hidden;color:var(--muted);font:12px/1.5 Consolas,monospace;text-overflow:ellipsis;white-space:nowrap}
                    time{flex:none;padding:4px 8px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:11px}
                    footer{margin-top:24px;color:var(--muted);font-size:12px}
                    a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
                    @media(max-width:600px){main{margin:34px auto}.branch{padding:16px}.branch li{align-items:flex-start;flex-direction:column;gap:4px}time{margin-left:0}}
                </style>
            </head>
            <body>
                <main>
                    <header class="hero">
                        <div class="eyebrow">Line Tech Softwares / Discovery</div>
                        <h1>Website sitemap</h1>
                        <p class="intro">Browse the pages available on Line Tech Softwares. Follow a branch to open a page or see when it was last updated.</p>
                    </header>
                    <div class="summary">
                        <div class="summary-card">
                            <strong><xsl:value-of select="count(sm:urlset/sm:url)" /></strong>
                            <span>Indexable pages</span>
                        </div>
                        <div class="summary-card">
                            <strong>linetechsoftwares.co.za</strong>
                            <span>Official website</span>
                        </div>
                    </div>
                    <div class="tree">
                        <section class="branch">
                            <h2>Website</h2>
                            <ul>
                                <xsl:apply-templates select="sm:urlset/sm:url[sm:loc='https://linetechsoftwares.co.za/' or sm:loc='https://linetechsoftwares.co.za/about' or sm:loc='https://linetechsoftwares.co.za/docs' or sm:loc='https://linetechsoftwares.co.za/features' or sm:loc='https://linetechsoftwares.co.za/projects' or sm:loc='https://linetechsoftwares.co.za/tools']" />
                            </ul>
                        </section>
                        <section class="branch">
                            <h2>Products &amp; projects</h2>
                            <ul>
                                <xsl:apply-templates select="sm:urlset/sm:url[not(contains(sm:loc, '/tools/')) and not(sm:loc='https://linetechsoftwares.co.za/') and not(sm:loc='https://linetechsoftwares.co.za/about') and not(sm:loc='https://linetechsoftwares.co.za/docs') and not(sm:loc='https://linetechsoftwares.co.za/features') and not(sm:loc='https://linetechsoftwares.co.za/projects') and not(sm:loc='https://linetechsoftwares.co.za/tools')]" />
                            </ul>
                        </section>
                        <section class="branch">
                            <h2>Online tools</h2>
                            <ul>
                                <xsl:apply-templates select="sm:urlset/sm:url[contains(sm:loc, '/tools/')]" />
                            </ul>
                        </section>
                    </div>
                    <footer>Generated from the XML sitemap. Search engines use this file to discover pages; inclusion does not guarantee indexing.</footer>
                </main>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="sm:url">
        <li>
            <a class="page" href="{sm:loc}">
                <span class="page-title">
                    <xsl:choose>
                        <xsl:when test="sm:loc='https://linetechsoftwares.co.za/'">Home</xsl:when>
                        <xsl:otherwise><xsl:value-of select="substring-after(sm:loc, 'https://linetechsoftwares.co.za/')" /></xsl:otherwise>
                    </xsl:choose>
                </span>
                <span class="page-url"><xsl:value-of select="sm:loc" /></span>
            </a>
            <xsl:if test="sm:lastmod">
                <time datetime="{sm:lastmod}">Updated <xsl:value-of select="sm:lastmod" /></time>
            </xsl:if>
        </li>
    </xsl:template>
</xsl:stylesheet>
