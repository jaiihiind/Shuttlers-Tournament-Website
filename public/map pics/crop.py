import os
import glob
from PIL import Image

folder = r"c:\STUDY MATERIAL\.antigravity\New badminton tournament\badminton-app\public\map pics"

def crop_black_borders(img_path):
    print(f"Processing {img_path}")
    img = Image.open(img_path)
    
    # Convert image to grayscale for easier thresholding
    gray = img.convert("L")
    
    # Get the bounding box of non-black pixels
    # Image.getbbox() returns the bounding box of the non-zero regions in the image.
    # To handle "mostly black", we can apply a point transform to threshold it.
    threshold = 15 # pixels darker than 15 are considered black
    bw = gray.point(lambda p: p > threshold and 255)
    
    bbox = bw.getbbox()
    
    if bbox:
        print(f"Cropping {img_path} to {bbox}")
        cropped_img = img.crop(bbox)
        cropped_img.save(img_path)
    else:
        print(f"Could not find bounding box for {img_path} (maybe it's all black?)")

for filepath in glob.glob(os.path.join(folder, "*.png")):
    crop_black_borders(filepath)

print("Done cropping.")
