 if ( -not (Test-Path -Path 'node_modules' -PathType Container) ) { 
   "Node_modules folder is missing => Running ""npm install""" 
   npm install
   npm install --save-dev check-dependencies
   npm audit fix
}
elseif ( -not (Test-Path -Path 'node_modules/check-dependencies' -PathType Container) ) {
   "Package ""check-dependencies"" is not installed => Running ""npm install --save-dev check-dependencies""" 
   npm install --save-dev check-dependencies 
   npm audit fix
}
else {
   "Checking dependencies"
   node node_modules/check-dependencies/bin/cli check-dependencies --install
}