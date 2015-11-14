# learn-mongo-index
A test program to describe how to use index correctly to make query faster

The testing result you should check the travis running result in here.

The log illustrate the query index is hit or not. And you should also pay attention to another two fields

- `totalDocsExamined`
- `totalKeysExamined`

If the above two goes too large, then this query may be quit slow.

