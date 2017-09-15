# Some notes on git commands

# Initial setup

## Use github to create a fork of the glacierhack2017 repo
# https://github.com/dshean/glacierhack2017.git

## Now, click the clone button on your github fork
# In a terminal, cd to the directory where you keep github repos and code, run the following, substituting the url you just copied
git clone https://github.com/USERNAME/glacierhack2017.git

## Now, let's add the remote repo
git remote add upstream https://github.com/dshean/glacierhack2017.git

# To make a change

# First, pull the latest version of the upstream repo
git pull upstream master

# Add a new file, or if you modified an existing file
git add newfile.py

# Commit your change, with a message
git commit -m 'Added newfile.py'

# Push to your forked repo (origin)
git push

#Now, on github, create a pull request if you want to add your newfile.py or changes to the upstream repo
