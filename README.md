# sequence
Create a sequence to provide incrementing integers. A sequence's `min` and `max` values can be configured as well as an incrementing `step`. For example:
```
const sequence = Sequence({ max: 3 });
sequence.next() // { value: 1, done: false }
sequence.next() // { value: 2, done: false }
sequence.next() // { value: 3, done: false }
sequence.next() // { value: undefined, done: true }
```