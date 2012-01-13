@echo off
del rrdfj-last.min.js 2>nul
java -jar \bin\closure_compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js rrdfj.js --js_output_file rrdfj-last.min.js
echo Created \rrdfj-last.min.js
