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

function* Sequence({ min = 0, max, step = 1, cycleFrom, existing = [] } = {}) {
    if (!Number.isInteger(min))
        throw Error(INVALID_MINIMUM);

    if (max !== undefined && !Number.isInteger(max))
        throw Error(INVALID_MAXIMUM);

    let next;
    if (typeof step === 'object') {
        if (!Number.isInteger(step.min) || !Number.isInteger(step.max))
            throw Error(INVALID_STEP_RANGE);

        if (step.max <= step.min)
            throw Error(INVALID_STEP_RANGE_MAXIMUM);

        const range = (step.max + 1) - step.min;
        next = function() {
            const variedStep = Math.floor(Math.random() * range) + step.min;
            return value = value + variedStep;
        };
    } else {
        if (!Number.isInteger(step))
            throw Error(INVALID_STEP);

        next = function() {
            return value = value + step;
        };
    }

    let value = min;

    while (max === undefined || value < max) {
        next();
        existing.push(value);
        yield value;
    }

    if (cycleFrom !== undefined && min !== cycleFrom) {
        value = min = cycleFrom;

        while (value < max) {
            next();
            if (!existing.includes(value)) {
                existing.push(value);
                yield value;
            }
        }

    }
}

module.exports = Sequence;