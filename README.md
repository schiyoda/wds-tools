# Node.js Tools for Watson Discovery Service

## How to use
### Install
    $ git clone https://github.com/schiyoda/wds-tools.git
    $ mkdir docs
    $ mkdir trains
    $ npm install

Change config files.

### Export documents
Export all documents in a collection to local 'docs' direcoty as JSON file
    
    $ node exportDocs

(*) Sometimes, the number of exported documents is not the same as collection for some reason. You can try multiple times until the number is the same.

### Import documents 
Import all JSON files in a local 'docs' directory to a collection

    $ node importDocs

(*) Sometimes, the number of imported documents is not the same as the number of files for some reason(network error etc). You can try multiple times until the number is the same.

### Export training data
Export training data in a collection to local 'trains' directoty as JSON files

    $ node exportTrains
    
### Import training data
Import training data in local 'trains' directory to a collction

    $ node importTrains

### Create documents from CSV file
Create JSONs from CSV files and create documents in a collection

    $ rm docs/*
    $ node convertCsv2Json filename.csv
    $ node createDocs

### Delete documents
Delete all documents from a collection

    $ node deleteDocs

### Delete training data
Delete all taining data from a collection

    $ node deleteTrains
