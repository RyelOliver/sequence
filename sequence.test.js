const Sequence = require('./sequence');

const INVALID_MINIMUM =
    'If a minimum value is provided, it must be an integer';
const INVALID_MAXIMUM =
    'If a maximum value is provided, it must be an integer';
const INVALID_STEP =
    'If a step value is provided, it must be an integer';
const INVALID_STEP_RANGE =
    'If a step range is provided, the minimum and maximum values must be an integer';
const INVALID_STEP_RANGE_MAXIMUM =
    'A step range\'s maximum must be greater than its minimum';

describe('A sequence', () => {
    describe('Without configuration', () => {
        const sequence = Sequence();

        it('Should start at 1', () => {
            expect(sequence.next()).toEqual({ value: 1, done: false });
        });

        it('Should increment by 1', () => {
            expect(sequence.next()).toEqual({ value: 2, done: false });
            expect(sequence.next()).toEqual({ value: 3, done: false });
        });

        it('Should increment forever', () => {
            expect(sequence.next()).toEqual({ value: 4, done: false });
            expect(sequence.next()).toEqual({ value: 5, done: false });
            expect(sequence.next()).toEqual({ value: 6, done: false });
        });
    });

    describe('With configuration', () => {
        it('Should increment from a minimum value', () => {
            const sequence = Sequence({ min: 4 });

            expect(sequence.next()).toEqual({ value: 5, done: false });
            expect(sequence.next()).toEqual({ value: 6, done: false });
        });

        it('Should error if the minimum value is not an integer', () => {
            const sequence = Sequence({ min: '4' });

            expect(() => sequence.next()).toThrow(INVALID_MINIMUM);
        });

        it('Should increment until a maximum value', () => {
            const sequence = Sequence({ max: 2 });

            expect(sequence.next()).toEqual({ value: 1, done: false });
            expect(sequence.next()).toEqual({ value: 2, done: false });
            expect(sequence.next()).toEqual({ value: undefined, done: true });
        });

        it('Should error if the maximum value is not an integer', () => {
            const sequence = Sequence({ max: 9.99 });

            expect(() => sequence.next()).toThrow(INVALID_MAXIMUM);
        });

        describe('For cycling', () => {
            it('Should not cycle if the provided integer matches the minimum value', () => {
                const sequence = Sequence({ min: 0, max: 3, cycleFrom: 0 });

                expect(sequence.next()).toEqual({ value: 1, done: false });
                expect(sequence.next()).toEqual({ value: 2, done: false });
                expect(sequence.next()).toEqual({ value: 3, done: false });
                expect(sequence.next()).toEqual({ value: undefined, done: true });
            });

            it('Should not cycle if the provided integer is greater than the minimum value', () => {
                const sequence = Sequence({ min: 0, max: 3, cycleFrom: 2 });

                expect(sequence.next()).toEqual({ value: 1, done: false });
                expect(sequence.next()).toEqual({ value: 2, done: false });
                expect(sequence.next()).toEqual({ value: 3, done: false });
                expect(sequence.next()).toEqual({ value: undefined, done: true });
            });

            it('Should cycle from the provided integer once reaching the maximum value', () => {
                const sequence = Sequence({ min: 4, max: 5, cycleFrom: 0 });

                expect(sequence.next()).toEqual({ value: 5, done: false });
                expect(sequence.next()).toEqual({ value: 1, done: false });
                expect(sequence.next()).toEqual({ value: 2, done: false });
            });

            describe('With existing values', () => {
                it('Should not cycle if the existing values include all values', () => {
                    const existing = [ 1, 2, 3, 4 ];
                    const sequence = Sequence({ min: 4, max: 5, cycleFrom: 0, existing });

                    expect(sequence.next()).toEqual({ value: 5, done: false });
                    expect(sequence.next()).toEqual({ value: undefined, done: true });
                });

                it('Should cycle, skipping any existing values', () => {
                    const existing = [ 2, 3 ];
                    const sequence = Sequence({ min: 4, max: 5, cycleFrom: 0, existing });

                    expect(sequence.next()).toEqual({ value: 5, done: false });
                    expect(sequence.next()).toEqual({ value: 1, done: false });
                    expect(sequence.next()).toEqual({ value: 4, done: false });
                    expect(sequence.next()).toEqual({ value: undefined, done: true });
                });
            });
        });

        describe('For its step', () => {
            it('Should increment by a positive step', () => {
                const sequence = Sequence({ step: 4 });

                expect(sequence.next()).toEqual({ value: 4, done: false });
                expect(sequence.next()).toEqual({ value: 8, done: false });
                expect(sequence.next()).toEqual({ value: 12, done: false });
            });

            it('Should decrement by a negative step', () => {
                const sequence = Sequence({ step: -4 });

                expect(sequence.next()).toEqual({ value: -4, done: false });
                expect(sequence.next()).toEqual({ value: -8, done: false });
                expect(sequence.next()).toEqual({ value: -12, done: false });
            });

            it('Should error if the step is not an integer', () => {
                let sequence;

                sequence = Sequence({ step: 0.5 });
                expect(() => sequence.next()).toThrow(INVALID_STEP);

                sequence = Sequence({ step: '1' });
                expect(() => sequence.next()).toThrow(INVALID_STEP);
            });

            describe('That is a step range', () => {
                it('Should increment by a varied step between the minimum and maximum', () => {
                    const start = 0;
                    const min = 5;
                    const max = 10;
                    const sequence = Sequence({ min: start, step: { min, max } });

                    const actual = sequence.next().value;
                    expect(actual).toBeGreaterThanOrEqual(start + min);
                    expect(actual).toBeLessThanOrEqual(start + max);

                    const nextActual = sequence.next().value;
                    expect(nextActual).toBeGreaterThanOrEqual(actual + min);
                    expect(nextActual).toBeLessThanOrEqual(actual + max);
                });

                it('Should error if the minimum and maximum values are not integers', () => {
                    let sequence;

                    sequence = Sequence({ step: {} });
                    expect(() => sequence.next()).toThrow(INVALID_STEP_RANGE);

                    sequence = Sequence({ step: { min: 1, max: 2.5 } });
                    expect(() => sequence.next()).toThrow(INVALID_STEP_RANGE);

                    sequence = Sequence({ step: { min: '1', max: '10' } });
                    expect(() => sequence.next()).toThrow(INVALID_STEP_RANGE);
                });

                it('Should error if the minimum and maximum values are not integers', () => {
                    const sequence = Sequence({ step: { min: 8, max: 4 } });
                    expect(() => sequence.next()).toThrow(INVALID_STEP_RANGE_MAXIMUM);
                });

            });
        });
    });
});