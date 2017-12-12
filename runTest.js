
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
	
//Edited Aug 15,2014
// Can be used to run all/selected tests.
// Also can be stopped on first failure
// Use -list option to list tests
// 'node runTest.js exampleTest.js ==> runs all tests',
// 'node runTest.js exampleTest.js -list ==> lists all tests',
// 'node runTest.js exampleTest.js -stop ==> stops on first failure',
// 'node runTest.js exampleTest.js -only namePart ==> runs all tests that match the namePart'
// Below are contents of exampleTest.js, a sample test file
//  
//-----------exampleTest.js----------------
//  var assert = require('assert');
//  var test = {};
//  test.sum_of_1_and_1_is_2 = function(){
//      assert.equal(1+1,2);
//  };
//  test.sum_of_1_and_3_is_4 = function(){
//      assert.equal(1+3,4);
//  };
//  exports.test = test;
//-----------------------------------------
 
var fs = require('fs');
var usages = ['node runTest.js exampleTest.js ==> runs all tests',
    'node runTest.js exampleTest.js -list ==> lists all tests',
    'node runTest.js exampleTest.js -stop ==> stops on first failure',
    'node runTest.js exampleTest.js -only namePart ==> runs all tests that match the namePart',
    'node runTest.js exampleTest.js -last   ==> runs all failing tests of the last run'
];
 
var printLine = function(line){console.log(line);};
 
var TestUsageException = function(message){
    this.message = message;
    this.name = 'TestUsageException';
};
var trim_undefined = function(item){return item || ''};
 
var quit = function(){
    console.log('Usage:');
    usages.forEach(printLine);
    var args = Array.prototype.slice.call(arguments, 0);
    console.log();
    console.log('error =>');
    console.log('\t',args.map(trim_undefined).join(' '));
    process.exit(0);
};
 
var readTestDetails = function(testfileName){
    console.log('loading tests from',testfileName);
    var test = require('./'+testfileName).test;
    test || quit('Missing test object in',testfileName);
    var members = Object.keys(test);
    var isAFunction = function(field){return ('function' == typeof test[field]);};
    var methods = members.filter(isAFunction);
    return {test:test,methodNames:methods};
};
var runTests = function(test,methodNames,option){
    var failed = 0;
    var failures = [];
    var total = 0;
    var executeTest = function(name){
        var member = test[name];
        if(!member) return;
        total++;
        console.log('--------');
        console.log('-->',name);
        try{            
            member();
        }catch(error){
            failed++;
            failures.push(name);
            console.log(error.stack);
            if(option === 'stop') throw {name:'User Requested to stop',message:'on first failure'};
        }
    };
    methodNames.forEach(executeTest);
    console.log('--------');    
    console.log(total-failed +'/'+total+' passed'); 
    fs.writeFile('.failures',failures.join());
};
 
 
var main = function(){
    var testName = process.argv[2];
    var option = process.argv[3];
    var filterText = process.argv[4];
    var matching = function(name){return name.indexOf(filterText)>=0;};
    var lastFailures = function(){
        return fs.existsSync('.failures') && fs.readFileSync('.failures','utf-8').split(',');
    };
 
    if(!fs.existsSync(testName)) quit('Missing testfile',testName);
    var testDetails = readTestDetails(testName);
 
    (option === '-list') && testDetails.methodNames.forEach(printLine);
    (option === '-stop') && runTests(testDetails.test,testDetails.methodNames,'stop');
    (option === '-only') && runTests(testDetails.test,testDetails.methodNames.filter(matching));
    (option === '-last') && runTests(testDetails.test,lastFailures() || testDetails.methodNames);
    option || runTests(testDetails.test,testDetails.methodNames);
};
 
main();

