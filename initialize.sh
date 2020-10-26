
#
# Run this script from the root of the hlf-cicero-contract directory
# 
# This script uploads the markdown text for a contract to the chaincode

cd app
npm i
node ./app initialize contract.md
cd ..