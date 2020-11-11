+++
title = "Trigonometry in Sass"
date = "2014-02-07"
tags = ["CSS", "Math"]
katex = true
+++

Have you ever found yourself needing trigonometric functions like sine, cosine, and tangent when writing your [Sass](https://sass-lang.com/) stylesheets? Ok, probably not, but the day may come, and you'll be glad you read this.
{.lead}

<!--more-->

{{< note >}}
**Update 2020-01-17:** Dart Sass 1.25.0 finally added trigonometric functions to the built-in `sass:math` module!
{{</ note >}}

{{< note >}}
**Update 2019-03-26:** The information in this article only applies to Ruby Sass, which has reached its end of life. Sass maintainers urge users to migrate to either Dart Sass or LibSass.
{{</ note >}}

When trying to create [some rotating 3D shapes with CSS]({{< ref "playground/3d-shapes-with-css" >}}), I realized that Sass lacks some key functionality. While it provides basic mathematical operators, and constructs like conditionals and loops, it doesn't include anything related to trigonometry!

Are we able to approximate a sine or a cosine iteratively in Sass? Only one way to find out.

## Numerical methods

People who know what they're doing seem to reach for [CORDIC](https://en.wikipedia.org/wiki/Cordic), [Chebyshev polynomials](https://en.wikipedia.org/wiki/Chebyshev_polynomial), or [Remez](https://en.wikipedia.org/wiki/Remez_algorithm) when needing to calculate trigonometric functions.

Unfortunately, I'm not one of those people. The most my brain can parse is the [Taylor expansions](https://en.wikipedia.org/wiki/Taylor_series) for sine and cosine:

<div>
$$
\begin{aligned}
\sin x & = \sum _{n=0}^{\infty}{\frac {(-1)^{n}}{(2n+1)!}}x^{{2n+1}} = x - {\frac {x^{3}}{3!}} + {\frac {x^{5}}{5!}} - \cdots \\
\cos x & = \sum _{n=0}^{\infty}{\frac {(-1)^{n}}{(2n)!}}x^{{2n}} = 1 - {\frac {x^{2}}{2!}} + {\frac {x^{4}}{4!}} - \cdots
\end{aligned}
$$
</div>

They'll have to do. Let's start translating things to Sass!

## Power

Numerators $x^{(2n+1)}$ and $x^{(2n)}$ require an exponentiation operator, but we don't have one in Sass, so we'll have to implement our own _power_ function:

<div>
$$
\begin{aligned}
b^{n} & = {\overbrace {b \times \cdots \times b}^{n}} \\
b^{-n} & = {\frac {1}{\underbrace {b \times \cdots \times b}_{n}}}
\end{aligned}
$$
</div>

Which could be translated into something like this:

```scss
@function pow($number, $exp) {
  $value: 1;
  @if $exp > 0 {
    @for $i from 1 through $exp {
      $value: $value * $number;
    }
  } @else if $exp < 0 {
    @for $i from 1 through -$exp {
      $value: $value / $number;
    }
  }
  @return $value;
}
```

## Factorial

Denominators $(2n+1)!$ and $(2n)!$ require us to implement a _factorial_ function:

<div>
$$
n! = {
\begin{cases}
1 & \text{if } n = 0 \\
(n-1)! \times n & \text{if } n > 0
\end{cases}
}
$$
</div>

Which could look like this:

```scss
@function fact($number) {
  $value: 1;
  @if $number > 0 {
    @for $i from 1 through $number {
      $value: $value * $i;
    }
  }
  @return $value;
}
```

## Sines, cosines, and tangents

Now we have all the necessary pieces to create our trigonometric functions, following the formulas of the Taylor expansions. Here we go:

```scss
@function pi() {
  @return 3.14159265359;
}

@function rad($angle) {
  $unit: unit($angle);
  $unitless: $angle / ($angle * 0 + 1);
  // If the angle has 'deg' as unit, convert to radians.
  @if $unit == deg {
    $unitless: $unitless / 180 * pi();
  }
  @return $unitless;
}

@function sin($angle) {
  $sin: 0;
  $angle: rad($angle);
  // Iterate a bunch of times.
  @for $i from 0 through 10 {
    $sin: $sin + pow(-1, $i) * pow($angle, (2 * $i + 1)) / fact(2 * $i + 1);
  }
  @return $sin;
}

@function cos($angle) {
  $cos: 0;
  $angle: rad($angle);
  // Iterate a bunch of times.
  @for $i from 0 through 10 {
    $cos: $cos + pow(-1, $i) * pow($angle, 2 * $i) / fact(2 * $i);
  }
  @return $cos;
}

@function tan($angle) {
  @return sin($angle) / cos($angle);
}
```

Do they work as expected?

```scss
@debug sin(pi() / 4); // => 0.70711
@debug cos(45deg); // => 0.70711
```

They do! High fives all around!

## Alternatives

If you don't mind getting your hands dirty and writing some Ruby code, you could extend the `Sass::Script::Functions` module with whatever functions you want. To do that, create a file (for example `sass_math.rb`) and paste the following contents:

```ruby
require 'sass'

module Sass::Script::Functions
  module CustomMath
    def pi()
      Sass::Script::Number.new(Math::PI)
    end
    Sass::Script::Functions.declare :pi, []

    def sin(number)
      trig(:sin, number)
    end
    Sass::Script::Functions.declare :sin, [:number]

    def cos(number)
      trig(:cos, number)
    end
    Sass::Script::Functions.declare :cos, [:number]

    def tan(number)
      trig(:tan, number)
    end
    Sass::Script::Functions.declare :tan, [:number]

    private

    def trig(operation, number)
      if number.numerator_units == ['deg'] && number.denominator_units == []
        Sass::Script::Number.new(Math.send(operation, Math::PI * number.value / 180))
      else
        Sass::Script::Number.new(Math.send(operation, number.value), number.numerator_units, number.denominator_units)
      end
    end
  end

  include CustomMath
end
```

What we're doing there is declaring the `pi`, `sin`, `cos` and `tan` functions so that they're accessible from our Sass stylesheets, and then delegating all the real work to the `Math` module in Ruby.

Let's invoke the `sass` command with our new file:

```
$ sass --require sass_math.rb input.scss output.css
```

Boom. It's not as fun as writing everything from scratch, but it's much more efficient.
