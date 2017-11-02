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
    
### Import documents 
Import all JSON files in a local 'docs' directory to a collection

    $ node importDocs
    
### Export training data
Export training data in a collection to local 'trains' directoty as JSON files

    $ node exportTrains
    
### Import training data
Import training data in local 'trains' directory to a collction

    $ node importTrains

### Delete documents
Delete all documents from a collection

    $ node deleteDocs

### Delete training data
Delete all taining data from a collection

    $ node deleteTrains
