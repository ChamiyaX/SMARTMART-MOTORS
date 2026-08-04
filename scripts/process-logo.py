from PIL import Image
import os

src = r"C:\Users\Chami\.cursor\projects\c-Users-Chami-Desktop-SMARTMART-MOTORS\assets\c__Users_Chami_AppData_Roaming_Cursor_User_workspaceStorage_5392ea0cb08e97788362c8d4c310904b_images_WhatsApp_Image_2026-08-04_at_4.32.20_PM-63ab279e-acda-471d-821d-eb29662af982.png"
out_dir = r"C:\Users\Chami\Desktop\SMARTMART MOTORS\public\images"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3.0
        sat = max(r, g, b) - min(r, g, b)

        # Soft-remove light backgrounds (keeps anti-aliased logo edges)
        if sat < 40 and brightness > 185:
            # fade alpha by how close to white
            fade = max(0, min(1, (245 - brightness) / 60))
            new_a = int(a * fade)
            if new_a < 12:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                # keep original color for slight fringe
                pixels[x, y] = (r, g, b, new_a)
            continue

        if brightness > 235 and sat < 50:
            pixels[x, y] = (0, 0, 0, 0)
            continue

        # Convert black "SMART" text to white for dark site backgrounds
        if brightness < 75 and sat < 45:
            pixels[x, y] = (255, 255, 255, a)

bbox = img.getbbox()
if bbox:
    # small padding
    pad = 8
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(w, bbox[2] + pad)
    bottom = min(h, bbox[3] + pad)
    img = img.crop((left, top, right, bottom))

img.save(os.path.join(out_dir, "logo.png"), "PNG", optimize=True)

img2 = img.copy()
if max(img2.size) < 1000:
    scale = 1000 / max(img2.size)
    img2 = img2.resize(
        (int(img2.width * scale), int(img2.height * scale)),
        Image.Resampling.LANCZOS,
    )
img2.save(os.path.join(out_dir, "logo-lg.png"), "PNG", optimize=True)

# Mark / favicon: left bike + SMART portion
fw = int(img.width * 0.38)
icon = img.crop((0, 0, fw, img.height))
side = max(icon.width, icon.height) + 24
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(
    icon,
    ((side - icon.width) // 2, (side - icon.height) // 2),
    icon,
)
square.resize((512, 512), Image.Resampling.LANCZOS).save(
    os.path.join(out_dir, "logo-mark.png"), "PNG", optimize=True
)
square.resize((64, 64), Image.Resampling.LANCZOS).save(
    os.path.join(out_dir, "favicon.png"), "PNG", optimize=True
)

print("OK", img.size)
