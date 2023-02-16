import { RawSourceMap } from "source-map";

declare class Concat {
	constructor(generateSourceMap: boolean, fileName: string, separator?: string);
	add(filePath: string | null, content: string | Buffer, sourceMap?: string | RawSourceMap): void;
	readonly content: Buffer;
	readonly sourceMap: string | undefined;
}

export = Concat;
