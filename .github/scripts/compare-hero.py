from __future__ import annotations

import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageOps


def normalized_pixels(path: Path):
    image = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    dimensions = list(image.size)
    pixels = list(image.resize((64, 64), Image.Resampling.LANCZOS).convert("L").getdata())
    return dimensions, pixels


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: compare-hero.py <git-image> <production-image>")

    git_dimensions, git_pixels = normalized_pixels(Path(sys.argv[1]))
    prod_dimensions, prod_pixels = normalized_pixels(Path(sys.argv[2]))

    mae = sum(abs(a - b) for a, b in zip(git_pixels, prod_pixels)) / (len(git_pixels) * 255.0)
    git_mean = sum(git_pixels) / len(git_pixels)
    prod_mean = sum(prod_pixels) / len(prod_pixels)
    covariance = sum((a - git_mean) * (b - prod_mean) for a, b in zip(git_pixels, prod_pixels))
    git_variance = sum((a - git_mean) ** 2 for a in git_pixels)
    prod_variance = sum((b - prod_mean) ** 2 for b in prod_pixels)
    denominator = math.sqrt(git_variance * prod_variance)
    correlation = covariance / denominator if denominator else 0.0

    result = {
        "available": True,
        "gitDimensions": git_dimensions,
        "productionDimensions": prod_dimensions,
        "normalizedMae": round(mae, 6),
        "correlation": round(correlation, 6),
        "matchesGitVisually": correlation >= 0.985 and mae <= 0.06,
    }
    print(json.dumps(result, separators=(",", ":")))


if __name__ == "__main__":
    main()
