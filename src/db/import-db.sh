#!/bin/bash
echo "-------------------------------------------------------------------"
echo "Starting to import 'problockexplorer' database!"
mongorestore -d problockexplorer /root/projects/backup/prodefi-block-explorer-worker/db/export/problockexplorer
echo "------------------------------DONE---------------------------------"