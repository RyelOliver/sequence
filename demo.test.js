// Mock random
Math.random = () => 0.5;

const HexBinary = require('./demo');

describe('A four digit hex binary sequence', () => {
    it('Should generate a hexadecimal value that is 8 characters long', () => {
        const hexBinary = HexBinary();
        expect(hexBinary.next()).toBe('00000001');
        expect(hexBinary.next()).toBe('00000002');
        expect(hexBinary.next()).toBe('00000003');
    });

    it('Should generate a hexadecimal value with a varied step', () => {
        const start = 0;
        const min = 1;
        const max = 10;
        const hexBinary = HexBinary({ min: start, step: { min, max } });
        const mockedRandom = Math.floor(((max + 1) - min) * Math.random()) + min;

        const actual = hexBinary.next();
        expect(actual).toHaveLength(8);
        expect(parseInt(actual, 16)).toBeGreaterThanOrEqual(start + min);
        expect(parseInt(actual, 16)).toBeLessThanOrEqual(start + max);
        expect(parseInt(actual, 16)).toBe(start + mockedRandom);

        const nextActual = hexBinary.next();
        expect(nextActual).toHaveLength(8);
        expect(parseInt(nextActual, 16)).toBeGreaterThanOrEqual(parseInt(actual, 16) + min);
        expect(parseInt(nextActual, 16)).toBeLessThanOrEqual(parseInt(actual, 16) + max);
        expect(parseInt(nextActual, 16)).toBe(parseInt(actual, 16) + mockedRandom);
    });

    it('Should generate a hexadecimal value until there are no more 8 characters long', () => {
        const hexBinary = HexBinary({ min: parseInt('FFFFFFFD', 16) });
        expect(hexBinary.next()).toBe('FFFFFFFE');
        expect(hexBinary.next()).toBe('FFFFFFFF');
        expect(() => hexBinary.next()).toThrow('The maximum ID has been reached');
    });
});