const { exec } = require('pkg');

exec([ 'package.json', '--output', '../distrib/ScratchPortable/scratch_portable.exe' ]);
