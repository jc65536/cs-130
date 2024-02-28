type FnMethods<A, B> = {
    pipe: <C>(g: (_: B) => C) => Fn<A, C>,
    before: (g: (_: A) => void) => Fn<A, B>,
    after: (g: (_: B) => void) => Fn<A, B>,
}

type Fn<A, B> = FnMethods<A, B> & { (_: A): B };

export const fn = <A, B>(f: (_: A) => B): Fn<A, B> =>
    Object.assign<typeof f, FnMethods<A, B>>(f, {
        pipe: g => fn(x => g(f(x))),
        before: g => fn(x => { g(x); return f(x) }),
        after: g => fn(x => { const y = f(x); g(y); return y }),
    });
