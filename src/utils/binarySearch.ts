/**
 * Performs a binary search, trying to minimize or maximize a given value while still satisfying your executor
 * @param exec The executor to determine whether this value is accepted
 * @param options Additional options for the search
 * @returns The optimized value that this holds for
 */
export async function binarySearch<T>(
    exec: (val: number) => Promise<{success: true; data: T} | {success: false}>,
    {
        minimize = false,
        max = 1e3,
        verbose = false,
        searchStep = false,
        allowNegative = false,
    }: {
        /** Whether to minimize the value instead of maximizing */
        minimize?: boolean;
        /** The maximum absolute value that may be reached */
        max?: number;
        /** Whether to log the tried values */
        verbose?: boolean;
        /** The step size to take in the initial rough search, or false to take doubling steps */
        searchStep?: number | false;
        /** Whether to allow negative values */
        allowNegative?: boolean;
    } = {}
): Promise<{data: T; value: number} | undefined> {
    const direction = minimize ? -1 : 1;

    // Find the first power of 2 for which this property no longer holds
    let power: number;
    if ((await exec(0)).success) {
        if (!allowNegative && minimize) return undefined;

        power = direction;
        while ((await exec(power)).success && Math.abs(power) < max) {
            if (verbose) console.log(`${power}: success`);

            if (searchStep) power += searchStep * direction;
            else power *= 2;
        }
    } else {
        if (!allowNegative && !minimize) return undefined;

        power = -1 * direction;
        while (!(await exec(power)).success && Math.abs(power) < max) {
            if (verbose) console.log(`${power}: success`);

            if (searchStep) power -= searchStep * direction;
            else power *= 2;
        }
    }
    if (Math.abs(power) >= max)
        throw Error(
            "The maximum value has been reached, make sure you have selected the right option for the `minimize` parameter"
        );

    if (verbose) console.log(`${power}: fail`);

    // Perform binary search to obtain the exact value
    let lastResult: {data: T; value: number} | undefined = undefined;
    let value = power;
    power = searchStep ? Math.pow(2, Math.ceil(Math.log2(searchStep))) : Math.abs(power);
    do {
        power /= 2;
        const {success, ...rest} = await exec(value);
        if (verbose) console.log(`${value}: ${success ? "success" : "fail"}`);

        if (success && "data" in rest) {
            lastResult = {data: rest.data, value};
            value += direction * power;
        } else {
            value -= direction * power;
        }
    } while (power >= 1);

    return lastResult;
}
