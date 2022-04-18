precision highp float;

uniform vec2 iResolution;

const float escapeRadius = 4.0;
const float escapeRadius2 = escapeRadius * escapeRadius;
const int maxIterations = 40;

vec2 ipow2(vec2 v) {
  return vec2(v.x * v.x - v.y * v.y, v.x * v.y * 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy - iResolution.xy * vec2(1.0 / 1.6, 1.0 / 2.0);
  uv *= 10.0 / min(3.0 * iResolution.x, 4.0 * iResolution.y);

  vec2 z = vec2(0.0);
  vec2 c = uv;
  int iteration;

  // Iterate until either the escape radius or max iteration is exceeded.
  for (int i = 0; i < maxIterations; i++) {
    z = ipow2(z) + c;
    if (dot(z, z) > escapeRadius2) {
      break;
    }
    iteration++;
  }

  float brightness = iteration >= maxIterations ? 0.0 : float(iteration) / float(maxIterations);

  gl_FragColor = vec4(vec3(brightness), 1.0);
}
