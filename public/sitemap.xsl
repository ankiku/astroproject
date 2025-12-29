<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

<xsl:output method="html" indent="yes"/>

<xsl:template match="/">
<html>
<head>
<title>XML Sitemap</title>
<style>
body{font-family:Arial;margin:40px;color:#333}
h1{font-size:22px}
table{border-collapse:collapse;width:100%;margin-top:20px}
th,td{border:1px solid #ddd;padding:10px}
th{background:#f4f4f4}
a{text-decoration:none;color:#1a73e8}
a:hover{text-decoration:underline}
.badge{background:#e8f0fe;color:#1967d2;padding:2px 6px;border-radius:4px;font-size:12px}
.note{margin-top:20px;color:#666;font-size:14px}
</style>
</head>

<body>

<h1>XML Sitemap</h1>

<table>
<tr>
  <th>URL</th>
  <th>Last Modified / Published</th>
  <th>Type</th>
</tr>

<!-- Sitemap index -->
<xsl:for-each select="s:sitemapindex/s:sitemap">
<tr>
  <td>
    <a href="{s:loc}">
      <xsl:value-of select="s:loc"/>
    </a>
  </td>
  <td>
    <xsl:value-of select="s:lastmod"/>
  </td>
  <td>
    <span class="badge">Sitemap</span>
  </td>
</tr>
</xsl:for-each>

<!-- Normal URLs -->
<xsl:for-each select="s:urlset/s:url">
<tr>
  <td>
    <a href="{s:loc}">
      <xsl:value-of select="s:loc"/>
    </a>
  </td>
  <td>
    <xsl:value-of select="s:lastmod"/>
    <xsl:value-of select="news:news/news:publication_date"/>
  </td>
  <td>
    <xsl:choose>
      <xsl:when test="news:news">
        <span class="badge">Google News</span>
      </xsl:when>
      <xsl:otherwise>
        <span class="badge">URL</span>
      </xsl:otherwise>
    </xsl:choose>
  </td>
</tr>
</xsl:for-each>

</table>

<div class="note">
  This sitemap is generated automatically.  
  Search engines use it for efficient crawling.  
</div>

<p class="note">
  Total entries:
  <xsl:value-of select="count(//s:url | //s:sitemap)"/>
</p>

</body>
</html>
</xsl:template>
</xsl:stylesheet>
