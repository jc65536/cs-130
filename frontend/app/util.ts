type FnMethods<A, B> = {
    pipe: <C>(g: (_: B) => C) => Fn<A, C>,
    then: <C>(g: (_: A) => C) => Fn<A, C>,
    effectAfter: (g: (_: B) => void) => Fn<A, B>,
    effectBefore: (g: (_: A) => void) => Fn<A, B>,
}

type Fn<A, B> = FnMethods<A, B> & { (_: A): B };

export const fn = <A, B>(f: (_: A) => B): Fn<A, B> =>
    Object.assign<typeof f, FnMethods<A, B>>(f, {
        pipe: g => fn(x => g(f(x))),
        then: g => fn(x => (f(x), g(x))),
        effectAfter: g => fn(x => { const y = f(x); g(y); return y }),
        effectBefore: g => fn(x => (g(x), f(x))),
    });
