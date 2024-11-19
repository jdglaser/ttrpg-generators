# Importing the PIL library
from PIL import Image, ImageDraw, ImageFont

# Open an Image
img = Image.open("playground/New Map (4).webp")

# Call draw Method to add 2D graphics in an image
I1 = ImageDraw.Draw(img)

# Custom font style and font size
font = ImageFont.truetype("/Library/Fonts/Arial.ttf", 16)

# Add Text to an image
# 450, 115
# coords = (115, 150)
# dist_col = 150
# dist_row = 86
# for o in range(27):
#     row_coord = coords[0] + (dist_row * o)
#     for i in range(13):
#         col_coord = coords[1] + (dist_col * i)
#         new_row_coord = row_coord + (0 if o in [0, 1] else 1 * (o - 1))
#         print(f"{new_row_coord}, {col_coord}")
#         I1.text((col_coord, new_row_coord), f"{i}.{o}", font=font, fill=(255, 0, 0))

# initial = [184, 69]
dist_row = 150
for i in range(27):
    new = 122 + (dist_row * i)
    I1.point([(42, new), (43, new)], fill=(255, 0, 0))

dist_col = 86
for i in range(13):
    new = 42 + (dist_col * i)
    I1.point([(new, 122), (new + 1, 122)], fill=(255, 0, 0))

# I1.text((250, 240), f"0.0", font=font, fill=(255, 0, 0))
# I1.text((10, 0), f"10.0", font=font, fill=(255, 0, 0))
# I1.text((208, 180))
# Display edited image
img.show()

# Save the edited image
# img.save("playground/image2.png")
