function clamp<T>(value: T, minValue: T, maxValue: T): T {
  return min(max(value, minValue), maxValue);
}

export function update(
  width: u32,
  height: u32,
  escapeRadius: f64,
  maxIterations: u32,
  extraIterations: u32,
  numColors: u32
): void {
  const escapeRadius2 = escapeRadius * escapeRadius;
  const invMaxIterations = 1.0 / maxIterations;

  const translateX = width * (1.0 / 1.6);
  const translateY = height * (1.0 / 2.0);
  const scale = 10.0 / min(3 * width, 4 * height);
  const realOffset = translateX * scale;

  for (let py: u32 = 0; py < height; py++) {
    const y0 = (py - translateY) * scale;
    const yOffset = (py * width) << 1;

    for (let px: u32 = 0; px < width; px++) {
      const x0 = px * scale - realOffset;
      const xOffset = px << 1;

      let x = 0.0;
      let y = 0.0;
      let x2 = 0.0;
      let y2 = 0.0;
      let iteration: u32 = 0;

      // Iterate until either the escape radius or max iteration is exceeded.
      // (Do a few extra iterations for quick escapes to reduce error margin.)
      while (x2 + y2 <= escapeRadius2 || iteration < extraIterations) {
        x2 = x * x;
        y2 = y * y;
        y = 2.0 * x * y + y0;
        x = x2 - y2 + x0;
        if (iteration >= maxIterations) {
          break;
        }
        iteration++;
      }

      // Iteration is a discrete value in the range [0, maxIterations] here, but we'd like it to be
      // normalized in the range [0, numColors] so it maps to the gradient we computed in JS.
      // See: http://linas.org/art-gallery/escape/escape.html
      let colorIndex = numColors - 1;
      const distance2 = x * x + y * y;
      if (distance2 > escapeRadius2) {
        const nu = Math.log2(Math.log(distance2) / 2.0);
        const fractionalIteration = clamp<f64>((iteration + 1 - nu) * invMaxIterations, 0.0, 1.0);
        colorIndex = <u32>(fractionalIteration * (numColors - 1));
      }

      store<u16>(yOffset + xOffset, colorIndex);
    }
  }
}
