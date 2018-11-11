cd /D "%~dp0"
cd ..\..\

call ..\node\nodevars

mkdir public
echo installing in main
call npm install

cd admin
echo installing in admin
call npm install
cd ..

set NODE_ENV=production
echo building in main
call npm run build

cd assets
call node getassets.js
cd ..

cd admin
echo building in admin
call npm run-script ng build admin "-c" production
cd ..