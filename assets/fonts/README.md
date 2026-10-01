# Fonts for the 《如果你来过》 teaser

Local copies so `teaser.html` renders offline.

| File | Font | License |
|---|---|---|
| `MaShanZheng-teaser.woff2` | [Ma Shan Zheng](https://fonts.google.com/specimen/Ma+Shan+Zheng), cut down to the characters the teaser uses (lyrics, her typed question, the title) plus ASCII | SIL OFL 1.1 (`OFL-MaShanZheng.txt`) |
| `PermanentMarker-Regular.ttf` | [Permanent Marker](https://fonts.google.com/specimen/Permanent+Marker) | Apache 2.0 (`LICENSE-PermanentMarker.txt`) |

If you add Chinese text the subset doesn't cover, `teaser.html` falls back to the full Ma Shan Zheng from Google Fonts when online. To rebuild the subset with the new characters (needs `pip install fonttools brotli` and the full `MaShanZheng-Regular.ttf` from Google Fonts):

```bash
pyftsubset MaShanZheng-Regular.ttf --text-file=chars.txt --unicodes="U+0020-007E" --flavor=woff2 --output-file=assets/fonts/MaShanZheng-teaser.woff2
```

where `chars.txt` holds every Chinese character and punctuation mark the teaser draws.
