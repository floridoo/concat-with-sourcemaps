'use strict';

var test = require('tape');
var Concat = require('..');

function testCase(description, options) {
  test(description, function(t) {
    // content as Buffer
    var concat = new Concat(options.sourceMapping, options.outFile, options.separator);
    options.input.forEach(function(input, i) {
      concat.add((input.fileName !== undefined ? input.fileName : 'test'+(i+1)), new Buffer(input.content), input.sourceMap);
    });
    t.equal(concat.content.toString(), options.output.content, 'should produce the right output');
    if (options.output.sourceMap)
      t.deepEqual(JSON.parse(concat.sourceMap), JSON.parse(options.output.sourceMap), 'should produce the right source map');
    else
      t.equal(concat.sourceMap, undefined, 'should not produce a source map');

    // content as string
    concat = new Concat(options.sourceMapping, options.outFile, options.separator);
    options.input.forEach(function(input, i) {
      concat.add((input.fileName !== undefined ? input.fileName : 'test'+(i+1)), input.content, input.sourceMap);
    });
    t.equal(concat.content.toString(), options.output.content, 'should produce the right output');
    if (options.output.sourceMap)
      t.deepEqual(JSON.parse(concat.sourceMap), JSON.parse(options.output.sourceMap), 'should produce the right source map');
    else
      t.equal(concat.sourceMap, undefined, 'should not produce a source map');
    t.end();
  });
}

testCase('should concatenate with "\\n"', {
  separator: '\n',
  sourceMapping: false,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAA\nBBB\nCCC'
  }
});

testCase('should concatenate with "\\n\\n"', {
  separator: '\n\n',
  sourceMapping: false,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAA\n\nBBB\n\nCCC'
  }
});

testCase('should concatenate with "\\nXXXX\\n"', {
  separator: '\nXXXX\n',
  sourceMapping: false,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAA\nXXXX\nBBB\nXXXX\nCCC'
  }
});

testCase('should concatenate with "XXXX"', {
  separator: 'XXXX',
  sourceMapping: false,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAAXXXXBBBXXXXCCC'
  }
});

testCase('should concatenate without separator specified', {
  separator: undefined,
  sourceMapping: false,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAABBBCCC'
  }
});

testCase('should concatenate with "\\n" and produce source map', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAA\nBBB\nCCC',
    sourceMap: '{"version":3,"file":"out.js","sources":["test1","test2","test3"],"names":[],"mappings":"AAAA;ACAA;ACAA"}'
  }
});

testCase('should concatenate with "\\n\\n" and produce source map', {
  separator: '\n\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAA\n\nBBB\n\nCCC',
    sourceMap: '{"version":3,"file":"out.js","sources":["test1","test2","test3"],"names":[],"mappings":"AAAA;;ACAA;;ACAA"}'
  }
});

testCase('should concatenate with "XXXX" and produce source map', {
  separator: 'XXXX',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAAXXXXBBBXXXXCCC',
    sourceMap: '{"version":3,"file":"out.js","sources":["test1","test2","test3"],"names":[],"mappings":"AAAA,OCAA,OCAA"}'
  }
});

testCase('should concatenate with "\\nXXXX" and produce source map', {
  separator: '\nXXXX',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAA\nXXXXBBB\nXXXXCCC',
    sourceMap: '{"version":3,"file":"out.js","sources":["test1","test2","test3"],"names":[],"mappings":"AAAA;ICAA;QCAA"}'
  }
});

testCase('should concatenate with "XXXX\\n" and produce source map', {
  separator: 'XXXX\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    { content: 'AAA' },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAAXXXX\nBBBXXXX\nCCC',
    sourceMap: '{"version":3,"file":"out.js","sources":["test1","test2","test3"],"names":[],"mappings":"AAAA;ACAA;ACAA"}'
  }
});

testCase('should concatenate mulitline content with "\\n" and produce source map', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    { content: 'AA\nA' },
    { content: 'BBB' },
    { content: 'CC\nC' }
  ],
  output: {
    content: 'AA\nA\nBBB\nCC\nC',
    sourceMap: '{"version":3,"file":"out.js","sources":["test1","test2","test3"],"names":[],"mappings":"AAAA;AACA;ACDA;ACAA;AACA"}'
  }
});

testCase('should concatenate content with source maps with "\\n" and produce combined source map', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    {
      content: 'AAA\nBBB\nCCC',
      sourceMap: '{"version":3,"file":"intermediate.js","sources":["test11","test12","test13"],"names":[],"mappings":"AAAA;ACAA;ACAA"}',
      fileName: 'intermediate.js'
    },
    { content: 'EEE' },
    { content: 'FFF' }
  ],
  output: {
    content: 'AAA\nBBB\nCCC\nEEE\nFFF',
    sourceMap: '{"version":3,"file":"out.js","sources":["test11","test12","test13","test2","test3"],"names":[],"mappings":"AAAA;ACAA;ACAA;ACAA;ACAA"}'
  }
});

testCase('should pass on source content', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    {
      content: 'AAA\nBBB\nCCC',
      sourceMap: '{"version":3,"file":"intermediate.js","sources":["test11","test12","test13"], "sourcesContent": ["AAA", "BBB", "CCC"], "names":[],"mappings":"AAAA;ACAA;ACAA"}',
      fileName: 'intermediate.js'
    },
    { content: 'EEE' },
    { content: 'FFF' }
  ],
  output: {
    content: 'AAA\nBBB\nCCC\nEEE\nFFF',
    sourceMap: '{"version":3,"file":"out.js","sources":["test11","test12","test13","test2","test3"],"names":[],"mappings":"AAAA;ACAA;ACAA;ACAA;ACAA","sourcesContent":["AAA","BBB","CCC",null,null]}'
  }
});

testCase('should pass on source content when mappings is empty', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    {
      content: 'AAA',
      sourceMap: '{"version":3,"file":"intermediate.js","sources":["test11"], "sourcesContent": ["AAA"], "names":[],"mappings":""}',
      fileName: 'intermediate.js'
    },
    { content: 'EEE' },
    { content: 'FFF' }
  ],
  output: {
    content: 'AAA\nEEE\nFFF',
    sourceMap: '{"version":3,"file":"out.js","sources":["test11","test2","test3"],"names":[],"mappings":"AAAA;ACAA;ACAA","sourcesContent":["AAA",null,null]}'
  }
});

testCase('should ignore invalid mappings', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    {
      content: 'AAA\nBBB\nCCC',
      sourceMap: '{"version":3,"file":"intermediate.js","sources":["test11","test12","test13"], "sourcesContent": ["AAA", "BBB", "CCC"], "names":[],"mappings":"A;ACAA;ACAA"}',
      fileName: 'intermediate.js'
    },
    { content: 'EEE' },
    { content: 'FFF' }
  ],
  output: {
    content: 'AAA\nBBB\nCCC\nEEE\nFFF',
    sourceMap: '{"version":3,"file":"out.js","sources":["test12","test13","test2","test3"],"names":[],"mappings":";AAAA;ACAA;ACAA;ACAA","sourcesContent":["BBB","CCC",null,null]}'
  }
});

testCase('should output unix style paths on Windows', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'test\\test\\out.js',
  input: [
    {
      content: 'AAA',
      fileName: 'test\\test1'
    },
    {
      content: 'BBB',
      fileName: 'test\\test2'
    },
    {
      content: 'CCC',
      fileName: 'test\\test3'
    }
  ],
  output: {
    content: 'AAA\nBBB\nCCC',
    sourceMap: '{"version":3,"file":"test/test/out.js","sources":["test/test1","test/test2","test/test3"],"names":[],"mappings":"AAAA;ACAA;ACAA"}'
  }
});

testCase('should keep source in sources with empty mappings', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    {
      content: 'AAA',
      sourceMap: '{"version":3,"file":"test1","sources":["testXXX"], "names":[],"mappings":""}'
    },
    { content: 'BBB' },
    { content: 'CCC' }
  ],
  output: {
    content: 'AAA\nBBB\nCCC',
    sourceMap: '{"version":3,"file":"out.js","sources":["testXXX","test2","test3"],"names":[],"mappings":"AAAA;ACAA;ACAA"}'
  }
});

testCase('should not crash with an input source map with no mappings', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    {
      content: 'AAA\nBBB\nCCC',
      sourceMap: '{"version":3,"file":"intermediate.js","sources":[],"names":[],"mappings":""}',
      fileName: 'intermediate.js'
    },
    { content: 'EEE' },
    { content: 'FFF' }
  ],
  output: {
    content: 'AAA\nBBB\nCCC\nEEE\nFFF',
    sourceMap: '{"version":3,"file":"out.js","sources":["intermediate.js", "test2", "test3"],"names":[],"mappings":"AAAA;AACA;AACA;ACFA;ACAA"}'
  }
});

testCase('should allow content without filename and produce no mapping for it', {
  separator: '\n',
  sourceMapping: true,
  outFile: 'out.js',
  input: [
    { content: '// Header', fileName: null },
    { content: 'AA\nA' },
    { content: 'BBB' },
    { content: '// inbetween', fileName: null },
    { content: 'CC\nC' },
    { content: '// Footer', fileName: null }
  ],
  output: {
    content: '// Header\nAA\nA\nBBB\n// inbetween\nCC\nC\n// Footer',
    sourceMap: '{"version":3,"file":"out.js","sources":["test2","test3","test5"],"names":[],"mappings":";AAAA;AACA;ACDA;;ACAA;AACA"}'
  }
});
