+++
title = "Lambda Calculus and the Y Combinator"
date = "2016-03-20"
tags = ["Lambda calculus"]
katex = true
draft = true
+++

These are some notes on lambda calculus and the Y combinator. After watching Jim Weirich's talk ["Y Not --- Adventures in Functional Programming"](https://www.youtube.com/watch?v=FITJMJjASUs), I felt I needed to write things down before I forgot them.
{.lead}

<!--more-->

{{< youtube id="FITJMJjASUs" title="Video for the talk \"Y Not -- Adventures in Functional Programming\" by Jim Weirich" >}}

I've translated all examples from Ruby to JavaScript, using arrow function expressions.

## Lambda calculus

Alonzo Church invented lambda calculus (or λ-calculus) in 1930 as a formal system for expressing computation.

## The problem

```js
const fact = (n) => (n === 0 ? 1 : n * fact(n - 1))

fact(5)
// 120
```

In lambda calculus we cannot assign things like this. We have to create a lambda expression and call it directly:

```js
(
  (n) => (n === 0 ? 1 : n * fact(n - 1))
)(5)
// Uncaught ReferenceError: fact is not defined
```

We are using `fact` in the definition of the function we're defining. In lambda calculus all functions are anonymous, so how can we define `fact` without referring to itself?

## Fixpoints

A fixpoint of a function is a value that, when given to that function, returns that same value:

<div>
$$
x = f(x)
$$
</div>

Examples:

<div>
$$
\begin{aligned}
  0 & = \sin 0 \\
  0 & = \sqrt 0 \\
  1 & = \sqrt 1
\end{aligned}
$$
</div>

## Higher-order functions

A higher-order function is a function that does at least one of the following:

- Takes one or more functions as arguments.
- Returns another function as its result.

Examples of higher-order functions:

```js
const makeAdder = (x) => (
  (n) => (n + x)
)

const compose = (f, g) => (
  (n) => f(g(n))
)

const add3 = compose(makeAdder(1), makeAdder(2))

add3(7)
// 10
```

## Functional refactorings

### Tennent's correspondence principle

If we have an expression _x_ and we surround it by a lambda, and then immediately call that lambda, we get _x_ back:

```js
add3(7)
// 10

add3((() => (7))())
// 10
```

### Introduce binding

If we have a lambda, we can add a new argument binding to it, and it will have no effect:

```js
add3((() => (7))())
// 10

add3(((n) => (7))(123456))
// 10
```

### Wrap function

If we have an expression that is a function of one argument, we can wrap that in a lambda of one argument, and then call the function inside that lambda and pass the argument down to the call site:

```js
add3(((n) => (n + 1))(6))
// 10

add3(((v) => ((n) => (n + 1))(v))(6))
// 10
```

### Inline definition

We can take any definition of a function, and replace invocations of that function with its definition:

```js
add3(7)
// 10

compose(makeAdder(1), makeAdder(2))(7)
// 10
```

## Back to the problem

We want to write a factorial function that's recursive, but we can't because we can't refer to `fact` inside the definition of `fact`, as these functions have no name:

```js
(
  (n) => (n === 0 ? 1 : n * fact(n - 1))
)(5)
// Uncaught ReferenceError: fact is not defined
```

Arguments do have a name though, so we could wrap that in a lambda:

```js
const makeFact = (fact) => (
  (n) => (n === 0 ? 1 : n * fact(n - 1))
)

const fact = makeFact(/* ??? */)
```

That won't work, as we still need to pass the definition of the factorial function.

Instead of having a `makeFact` function that takes the definition of the factorial function, let's have a `factImprover` function that takes a partial definition of factorial, i.e. a function that acts like factorial over a subset of the possible inputs. Our `factImprover` will improve any factorial definition by one step, so if we pass it a factorial definition that works from 0 to 10, it will return a new definition that works from 0 to 11.

Let's start with 0:

```js
const error = () => {
  throw new Error("SHOULD NEVER BE CALLED")
}

const factImprover = (partial) => (
  (n) => (n === 0 ? 1 : n * partial(n - 1))
)

const f0 = factImprover(error)

f0(0)
// 1

f0(1)
// Uncaught Error: SHOULD NEVER BE CALLED
```

If we can calculate the factorial of 0, we can calculate the factorial of 1:

```js
const f0 = factImprover(error)
const f1 = factImprover(f0)

f1(1)
// 1

f1(2)
// Uncaught Error: SHOULD NEVER BE CALLED
```

And if we can calculate the factorial of 1, we can calculate the factorial of 2:

```js
const f0 = factImprover(error)
const f1 = factImprover(f0)
const f2 = factImprover(f1)

f2(2)
// 2

f2(3)
// Uncaught Error: SHOULD NEVER BE CALLED
```

Ok, let's inline some of these things, and rename `f2` to `fx`:

```js
const fx = factImprover(factImprover(factImprover(error)))

fx(2)
// 2

fx(3)
// Uncaught Error: SHOULD NEVER BE CALLED
```

If we keep nesting calls maybe we'll get somewhere?

```js
const fx = factImprover(factImprover(factImprover(factImprover(factImprover(factImprover(error))))))

fx(5)
// 120

fx(6)
// Uncaught Error: SHOULD NEVER BE CALLED
```

That won't get us the real factorial function though.

Let's wrap our improver in a lambda again, to avoid the assignment:

```js
const error = () => {
  throw new Error("SHOULD NEVER BE CALLED")
}

const fx = (
  (improver) => improver(improver(error))
)(
  (partial) => (
    (n) => (n === 0 ? 1 : n * partial(n - 1))
  )
)

fx(1)
// 1

fx(2)
// Uncaught Error: SHOULD NEVER BE CALLED
```

If we get rid of that `error` function, we should get a function that works for the factorial of 0:

```js
const fx = (
  (improver) => improver(improver)
)(
  (partial) => (
    (n) => (n === 0 ? 1 : n * partial(n - 1))
  )
)

fx(0)
// 1

fx(1)
// NaN
```

The problem is in that `n * partial(n - 1)` operation, as `partial` is an `improver`, and `improver` expects a function, not a number. We may see it clearer by renaming `partial` to `improver`:

```js
const fx = (
  (improver) => improver(improver)
)(
  (improver) => (
    (n) => (n === 0 ? 1 : n * improver(n - 1))
  )
)
```

If `improver` expects a function, we've got one for it:

```js
const fx = (
  (improver) => improver(improver)
)(
  (improver) => (
    (n) => (n === 0 ? 1 : n * improver(improver)(n - 1))
  )
)

fx(1)
// 1

fx(2)
// 2

fx(5)
// 120
```

If we get rid of the assignment, we'll have a pure lambda expression that calculates a factorial:

```js
(
  (improver) => improver(improver)
)(
  (improver) => (
    (n) => (n === 0 ? 1 : n * improver(improver)(n - 1))
  )
)(5)
// 120
```

Let's rename `improver`, as it's no longer taking a partial definition. We'll call it `gen`, as it's some kind of generator that produces a recursive function when it swallows itself:

```js
(
  (gen) => gen(gen)
)(
  (gen) => (
    (n) => (n === 0 ? 1 : n * gen(gen)(n - 1))
  )
)(5)
// 120
```

The `improver` approach was easier to reason about, so let's try to get back to it. We're going to take the inner lambda, and apply Tennent's correspondence principle to it:

```js
(
  (gen) => gen(gen)
)(
  (gen) => (
    (() => (
      (n) => (n === 0 ? 1 : n * gen(gen)(n - 1))
    ))()
  )
)(5)
// 120
```

Now let's introduce a new binding, `code`:

```js
const error = () => {
  throw new Error("SHOULD NEVER BE CALLED")
}

(
  (gen) => gen(gen)
)(
  (gen) => (
    ((code) => (
      (n) => (n === 0 ? 1 : n * gen(gen)(n - 1))
    ))(error)
  )
)(5)
// 120
```

Instead of `error`, let's pass `gen`:

```js
(
  (gen) => gen(gen)
)(
  (gen) => (
    ((code) => (
      (n) => (n === 0 ? 1 : n * gen(gen)(n - 1))
    ))(gen)
  )
)(5)
// 120
```

What if we pass `gen(gen)`?

```js
(
  (gen) => gen(gen)
)(
  (gen) => (
    ((code) => (
      (n) => (n === 0 ? 1 : n * gen(gen)(n - 1))
    ))(gen(gen))
  )
)(5)
// Uncaught RangeError: Maximum call stack size exceeded
```

Before, we were only calling `gen(gen)` when `n !== 0`, so we had no issues. Now we're calling `gen(gen)` even when `n === 0`, so it's recursing infinitely.

Well, we can delay evaluation by wrapping thing in a function:

```js
(
  (gen) => gen(gen)
)(
  (gen) => (
    ((code) => (
      (n) => (n === 0 ? 1 : n * gen(gen)(n - 1))
    ))((v) => gen(gen)(v))
  )
)(5)
// 120
```

If we apply the same refactoring to the inner lambda:

```js
(
  (gen) => gen(gen)
)(
  (gen) => (
    ((code) => (
      (n) => (n === 0 ? 1 : n * ((v) => gen(gen)(v))(n - 1))
    ))((v) => gen(gen)(v))
  )
)(5)
// 120
```

Then we can replace that thing with `code`:

```js
(
  (gen) => gen(gen)
)(
  (gen) => (
    ((code) => (
      (n) => (n === 0 ? 1 : n * code(n - 1))
    ))((v) => gen(gen)(v))
  )
)(5)
// 120
```

Let's rename `code` to `partial`:

```js
(
  (gen) => gen(gen)
)(
  (gen) => (
    ((partial) => (
      (n) => (n === 0 ? 1 : n * partial(n - 1))
    ))((v) => gen(gen)(v))
  )
)(5)
// 120
```

Hey, we've got our improver function back! But it's buried under a ton of stuff, so let's try to pull it out. We'll start by applying Tennent's correspondence principle to the entire body of the function:

```js
(() => (
  (
    (gen) => gen(gen)
  )(
    (gen) => (
      ((partial) => (
        (n) => (n === 0 ? 1 : n * partial(n - 1))
      ))((v) => gen(gen)(v))
    )
  )
))()(5)
// 120
```

Let's introduce a new binding, `code`, like last time:

```js
const error = () => {
  throw new Error("SHOULD NEVER BE CALLED")
}

((code) => (
  (
    (gen) => gen(gen)
  )(
    (gen) => (
      ((partial) => (
        (n) => (n === 0 ? 1 : n * partial(n - 1))
      ))((v) => gen(gen)(v))
    )
  )
))(error)(5)
// 120
```

If instead of `error` we pass our improver function, we can pull it out:

```js
((code) => (
  (
    (gen) => gen(gen)
  )(
    (gen) => (
      code((v) => gen(gen)(v))
    )
  )
))(
  (partial) => (
    (n) => (n === 0 ? 1 : n * partial(n - 1))
  )
)(5)
// 120
```

Now let's rename `code` to be `improver`:

```js
((improver) => (
  (
    (gen) => gen(gen)
  )(
    (gen) => (
      improver((v) => gen(gen)(v))
    )
  )
))(
  (partial) => (
    (n) => (n === 0 ? 1 : n * partial(n - 1))
  )
)(5)
// 120
```

Now that we've got a complete lambda expression, let's pull the pieces out and name them, so that we can reason about them:

```js
const factImprover = (partial) => (
  (n) => (n === 0 ? 1 : n * partial(n - 1))
)

const y = (improver) => (
  ((gen) => gen(gen))(
    (gen) => improver((v) => gen(gen)(v))
  )
)

const fact = y(factImprover)

fact(5)
// 120
```

If we try to improve `fact`, we'll get the same function:

```js
const fact = y(factImprover)
const improvedFact = factImprover(fact)

improvedFact(5)
// 120
```

So `fact` is the fixpoint of `factImprover`. Higher-order functions have fixpoints as well.

The function `y` calculates the fixpoint of an improver function. It is the famous _Y_ combinator! Mathematicians don't like intention-revealing names, so you may see it in this form:

```js
const y = (f) => (
  ((x) => x(x))(
    (x) => f((v) => x(x)(v))
  )
)
```

This, in particular, is the applicative-order _Y_ combinator, also known as _Z_ combinator. JavaScript is an applicative language. In other words, it evaluates its arguments before it passes the arguments down into functions.

An example of a language that's not applicative would be Haskell. Haskell is lazy, it will evaluate its arguments only at the point it really needs them. The normal-order _Y_ combinator just removes the wrapping lambda we introduced to delay execution.

You may see the _Y_ combinator expressed slightly differently. If we call our improver function `f` with `x(x)`, that'll be a no-op:

```js
const y = (f) => (
  ((x) => f(x(x)))(
    (x) => f((v) => x(x)(v))
  )
)
```

If we now wrap that thing in a lambda, we'll get a nice simmetry:

```js
const y = (f) => (
  ((x) => f((v) => x(x)(v)))(
    (x) => f((v) => x(x)(v))
  )
)
```

## Related readings

- [The Little Schemer](https://amzn.unindented.org/0262560992)
- [Understanding Computation](https://amzn.unindented.org/1449329276)
