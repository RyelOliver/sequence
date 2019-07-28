const Sequence = require('./sequence');

const MAX = parseInt('FFFFFFFF', 16);

function HexBinary(args) {
    const sequence = Sequence({ ...args, max: MAX });
    return {
        next: function() {
            const next = sequence.next();

            if (next.done)
                throw Error('The maximum ID has been reached');

            let id = next.value.toString(16).toUpperCase();

            let appendLeadingZeros = 8 - id.length;
            while (appendLeadingZeros > 0) {
                id = `0${id}`;
                appendLeadingZeros--;
            }

            return id;
        },
    };
}

module.exports = HexBinary;