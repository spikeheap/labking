# Looking up SELECT options

Each row in returned by the `DataSetColumns` query may contain lookup information, which is required to populate the options for drop-down selects:
```
LookupContainer: "df71ab40-aec9-1032-9828-778d5d9fd950"
LookupQuery: "lkGender"
LookupSchema: "lists"
```

We're making the crass assumption that the `LookupContainer` will be the same as the container We're operating in, which should be true for most use-cases, and simplifies the implementation considerably.

We can find the set of available lookups using the `lists` schema:

```javascript
var lookupNames = LABKEY.Query.getQueries({ 
  schemaName: 'lists', 
  success: function(data){ 
    console.log(data.queries.map(function(i){return i.name}));
  } 
});
```

So we can then iterate over that list to pull the options for each list:

```javascript
var selectSets = {};
lookupNames.forEach(function(lookupName){
  LABKEY.Query.selectRows({
    schemaName: 'lists',
    queryName: lookupName,
    success: function(data){ 
      selectSets[lookupName] = data.rows;
    } 
  });
});
```
