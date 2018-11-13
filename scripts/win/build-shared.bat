mkdir public
echo installing in main
call npm install

cd admin
echo installing in admin
call npm install
cd ..

cd server
echo installing in server
call npm install
cd ..

set NODE_ENV=production
echo building in main
call npm run build

cd admin
echo building in admin
call npm run-script ng build admin "-c" production
cd ..

cd assets
call node getassets.js
cd ..
