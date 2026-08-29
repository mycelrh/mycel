Add-Type -AssemblyName System.Drawing

$field = [System.Drawing.Color]::FromArgb(46,86,200)
$fieldDeep = [System.Drawing.Color]::FromArgb(26,58,160)
$ink = [System.Drawing.Color]::FromArgb(12,16,36)
$paper = [System.Drawing.Color]::FromArgb(251,250,247)
$hot = [System.Drawing.Color]::FromArgb(228,87,46)

$W = 512; $H = 512
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# background field
$g.FillRectangle((New-Object System.Drawing.SolidBrush $field), 0, 0, $W, $H)

# border ring
$borderPen = New-Object System.Drawing.Pen($fieldDeep, 14)
$g.DrawRectangle($borderPen, 7, 7, $W-14, $H-14)

$cx = 256; $cy = 256
$points = @(
  @(406,256),
  @(331,126),
  @(181,126),
  @(106,256),
  @(181,386),
  @(331,386)
)

$linePen = New-Object System.Drawing.Pen($ink, 7)
foreach ($p in $points) {
  $g.DrawLine($linePen, $cx, $cy, $p[0], $p[1])
}

$nodePen = New-Object System.Drawing.Pen($ink, 6)
$paperBrush = New-Object System.Drawing.SolidBrush($paper)
$hotBrush = New-Object System.Drawing.SolidBrush($hot)

for ($i = 0; $i -lt $points.Length; $i++) {
  $p = $points[$i]
  if ($i -eq 0) {
    $size = 28
    $x = $p[0] - $size/2; $y = $p[1] - $size/2
    $g.FillRectangle($hotBrush, $x, $y, $size, $size)
    $g.DrawRectangle($nodePen, $x, $y, $size, $size)
  } else {
    $size = 20
    $x = $p[0] - $size/2; $y = $p[1] - $size/2
    $g.FillRectangle($paperBrush, $x, $y, $size, $size)
    $g.DrawRectangle($nodePen, $x, $y, $size, $size)
  }
}

# center node
$csize = 34
$g.FillRectangle($paperBrush, $cx - $csize/2, $cy - $csize/2, $csize, $csize)
$g.DrawRectangle((New-Object System.Drawing.Pen($ink, 7)), $cx - $csize/2, $cy - $csize/2, $csize, $csize)

$bmp.Save("C:\Users\wenis\Desktop\rh coin\assets\mycel-avatar.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output "avatar rendered"
