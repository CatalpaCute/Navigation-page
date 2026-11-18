# 视觉素材记录

采用内置 image_gen，每项素材生成一次。

- `public/assets/marble.jpg`：1536 × 1024，生成图的 JPEG 优化导出。
- `public/assets/ink.png`：1536 × 1024，保留真实透明通道。页面用原图右半边及其水平镜像构成左右对称的收边，以原图透明通道作为遮罩，着暖灰棕色、透明度 32%，压成署名下沿的窄笔痕，不覆盖文字。
- `public/assets/photos/`：来自 `https://me.czzzz.work/masonry/` 的个人摄影，缩放后最长边不超过 1600 像素。

## 大理石提示词

Create one landscape raster image at 1536x1024 pixels, aspect ratio 3:2, of a pale creamy yellow marble surface, viewed perfectly flat from above. The texture fills the entire image edge to edge. Large areas of quiet, low-contrast negative space, suitable as a background beneath black typography and photographs. Very pale warm cream-yellow base; extremely thin, delicate natural veins in warm gray and muted soft golden yellow. Subtle authentic marble veining, sparse and organic, matte, soft, refined editorial feeling. Entirely flat texture; no reflections, no shine, no depth, no perspective, no objects, no typography, no symbols, no logos, no watermark. Avoid gold foil, metallic glitter, thick veins, fissures, cracks, dramatic contrast, harsh black lines, beige stone blocks, tiles, seams.

## 墨痕提示词

Create one landscape raster PNG at 1536x1024 pixels, aspect ratio 3:2, with a genuinely transparent alpha background. The only visible subject is ONE horizontal ink-black splattered dry-brush stroke. One broad, flattened, long horizontal brush mark across the middle of the canvas. Width about 85% of canvas, height about 25% of canvas, with generous transparent space above and below. The stroke is a single coherent gesture. Natural black ink applied with a wide dry brush; restrained elegant editorial art direction. The central majority is continuous solid opaque ink black, with a few natural dry-brush gaps and irregular finely frayed edges. A small number of restrained tiny ink droplets close to the stroke. Actual transparent alpha everywhere outside the single stroke; no colored or white backdrop; no paper; no shadow; no objects; no lettering, typography, symbols, logos, or watermark. Only one stroke, not multiple layered marks. Avoid checkerboard pattern baked into the pixels, gray background, white background, dramatic splashes, numerous droplets, excessive transparent holes in the center, vertical strokes, multiple separate brush marks.

## 字体

左上角署名使用 Outfit（300–600 可变字重），标题使用 Lato（300、400 字重），正文使用 Manrope。字体与 SIL Open Font License 均保存在 public/assets/fonts/，网页不依赖外部字体服务。
