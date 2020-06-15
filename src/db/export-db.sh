#!/bin/bash
echo "-------------------------------------------------------------------"
echo "------------Starting to export from  'problockexplorer'------------"
mongodump -d problockexplorer -o /root/projects/backup/prodefi-block-explorer-worker/db/export
echo "-------------------------------------------------------------------"
echo "------------------------------DONE---------------------------------"