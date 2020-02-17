type Step = number | { min?: number; max?: number; };

interface ISequenceArgs {
	min?: number;
	max?: number;
	step?: Step;
	cycleFrom?: number;
	existing?: number[];
}

declare function Sequence(args?: ISequenceArgs): number;

declare namespace Sequence { }

export = Sequence;