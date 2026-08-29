Add-Type -AssemblyName System.Drawing

$field = [System.Drawing.Color]::FromArgb(46,86,200)
$ink = [System.Drawing.Color]::FromArgb(12,16,36)
$paper = [System.Drawing.Color]::FromArgb(251,250,247)
$hot = [System.Drawing.Color]::FromArgb(228,87,46)
$lightBlue = [System.Drawing.Color]::FromArgb(199,208,240)
$mutedBlue = [System.Drawing.Color]::FromArgb(154,166,214)
$gridLine = [System.Drawing.Color]::FromArgb(30,255,255,255)

$W = 1500; $H = 500
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$g.FillRectangle((New-Object System.Drawing.SolidBrush $field), 0, 0, $W, $H)

# faint grid
$gridPen = New-Object System.Drawing.Pen($gridLine, 1)
for ($x = 0; $x -lt $W; $x += 34) { $g.DrawLine($gridPen, $x, 0, $x, $H) }
for ($y = 0; $y -lt $H; $y += 34) { $g.DrawLine($gridPen, 0, $y, $W, $y) }

# wordmark
$wordFont = New-Object System.Drawing.Font("Arial Black", 78, [System.Drawing.FontStyle]::Regular)
$g.DrawString("MYCEL", $wordFont, (New-Object System.Drawing.SolidBrush $paper), 66, 58)

# tagline (italic)
$tagFont = New-Object System.Drawing.Font("Georgia", 26, [System.Drawing.FontStyle]::Italic)
$g.DrawString("grows toward the trade.", $tagFont, (New-Object System.Drawing.SolidBrush $paper), 70, 172)

# mono status line
$dot = [char]0x00B7
$monoFont = New-Object System.Drawing.Font("Consolas", 14, [System.Drawing.FontStyle]::Bold)
$g.DrawString("`$MYC  $dot  ROBINHOOD CHAIN  $dot  GENESIS ROUTE MYC/COIN.USD", $monoFont, (New-Object System.Drawing.SolidBrush $lightBlue), 70, 222)

# rule
$rulePen = New-Object System.Drawing.Pen($lightBlue, 1.5)
$g.DrawLine($rulePen, 70, 262, 700, 262)

$monoFont2 = New-Object System.Drawing.Font("Consolas", 12, [System.Drawing.FontStyle]::Bold)
$g.DrawString("SPEC NO. MYC-0114-RH  $dot  TOKEN IN DEVELOPMENT", $monoFont2, (New-Object System.Drawing.SolidBrush $mutedBlue), 70, 276)

# ---- right side: condensed mesh diagram ----
$whitePen2 = New-Object System.Drawing.Pen($paper, 2)
$hotDashPen = New-Object System.Drawing.Pen($hot, 3)
$hotDashPen.DashPattern = @(6,4)

# relay node boxes (top-left, bottom-left, top-right, bottom-right)
$tl = @(945,135); $bl = @(945,315); $tr = @(1065,135); $br = @(1065,315)
$coin = @(1185,225); $chain = @(1290,200)

# outer box wires
$g.DrawLine($whitePen2, $tl[0]+30, $tl[1]+15, $tr[0], $tr[1]+15)
$g.DrawLine($whitePen2, $tl[0]+15, $tl[1]+30, $bl[0]+15, $bl[1])
$g.DrawLine($whitePen2, $bl[0]+30, $bl[1]+15, $br[0], $br[1]+15)
$g.DrawLine($whitePen2, $tr[0]+15, $tr[1]+30, $br[0]+15, $br[1])

# hot dashed diagonals into coin node
$g.DrawLine($hotDashPen, $tl[0]+15, $tl[1]+15, $coin[0]+22, $coin[1]+15)
$g.DrawLine($hotDashPen, $bl[0]+15, $bl[1]+15, $coin[0]+22, $coin[1]+15)

# solid lines from right nodes into coin
$g.DrawLine($whitePen2, $tr[0]+15, $tr[1]+15, $coin[0]+22, $coin[1]+15)
$g.DrawLine($whitePen2, $br[0]+15, $br[1]+15, $coin[0]+22, $coin[1]+15)

# relay boxes themselves
foreach ($node in @($tl,$bl,$tr,$br)) {
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $field), $node[0], $node[1], 30, 30)
  $g.DrawRectangle((New-Object System.Drawing.Pen($paper, 2.5)), $node[0], $node[1], 30, 30)
}

# coin node
$g.FillRectangle((New-Object System.Drawing.SolidBrush $paper), $coin[0], $coin[1], 44, 30)
$g.DrawRectangle((New-Object System.Drawing.Pen($hot, 3)), $coin[0], $coin[1], 44, 30)
$coinFont = New-Object System.Drawing.Font("Arial", 9, [System.Drawing.FontStyle]::Bold)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("COIN", $coinFont, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(26,58,160))), $coin[0]+22, $coin[1]+9, $sf)

# connector coin -> chain
$g.DrawLine($whitePen2, $coin[0]+44, $coin[1]+15, $chain[0], $chain[1]+40)

# chain box
$g.FillRectangle((New-Object System.Drawing.SolidBrush $ink), $chain[0], $chain[1], 120, 80)
$chainFont = New-Object System.Drawing.Font("Arial Black", 13, [System.Drawing.FontStyle]::Regular)
$g.DrawString("ROBINHOOD", $chainFont, (New-Object System.Drawing.SolidBrush $paper), $chain[0]+60, $chain[1]+24, $sf)
$g.DrawString("CHAIN", $chainFont, (New-Object System.Drawing.SolidBrush $paper), $chain[0]+60, $chain[1]+46, $sf)

$bmp.Save("C:\Users\wenis\Desktop\rh coin\assets\mycel-banner.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output "banner rendered"
