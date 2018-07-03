# Node.js Tools for Watson Discovery Service

## How to use
### Install
    $ git clone https://github.com/schiyoda/wds-tools.git
    
    $ mkdir docs
    $ mkdir trains
    $ npm install

Change config files.

### Export documents
Export all documents in a WDS collection to a local 'docs' direcoty as JSON files
    
    $ node exportDocs

(*) Sometimes, the number of exported documents is not the same as collection for some reasons. You can try multiple times until the number is the same.

### Import documents 
Import all JSON files in a local 'docs' directory to a WDS collection

    $ node importDocs

(*) Sometimes, the number of imported documents is not the same as the number of files for some reasons(network error etc). You can try multiple times until the number is the same.

### Export training data
Export training data in a WDS collection to a local 'trains' directoty as JSON files

    $ node exportTrains
    
### Import training data
Import training data in a local 'trains' directory to a WDS collction

    $ node importTrains

### Create documents from CSV file
Create JSON files from CSV file and create documents in a WDS collection

    $ rm docs/*
    $ node convertCsv2Json filename.csv
    $ node createDocs

### Delete documents
Delete all documents in a WDS collection

    $ node deleteDocs

### Delete training data
Delete all taining data in a WDS collection

    $ node deleteTrains
