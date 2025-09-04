const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    let result: Record<string, any> = {};
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value)
        ) {
            Object.assign(result, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const arrayKey = `${newKey}.${index}`;
                if (
                    item !== null &&
                    typeof item === 'object'
                ) {
                    Object.assign(result, flattenObject(item, arrayKey));
                } else {
                    result[arrayKey] = item;
                }
            });
        } else {
            result[newKey] = value;
        }
    }
    return result;
}

// type utility to infer flattened shape
type Flatten<T, Prefix extends string = ''> = {
    [K in keyof T]: T[K] extends object
        ? T[K] extends Array<infer U>
        ? U extends object
        ? Flatten<U, `${Prefix}${K & string}.${number}`>
            : { [P in `${Prefix}${K & string}.${number}`]: U }
        : Flatten<T[K], `${Prefix}${K & string}.`>
        : { [P in `${Prefix}${K & string}`]: T[K] }
}[keyof T];
