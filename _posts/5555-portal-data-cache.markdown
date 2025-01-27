

* Cache is per Power Pages user
* Transaction data create/update/delete operations from the Power Pages side will clear the cache immediately
* However the data updates from non-Power Pages sources will NOT clear the cache and the SLA is 15 minute to reflect the latest data change
* The workaround is to create FetchXML or OData queries which are always unique. The simplest way is to use a timestamp. e.g. createdon less than now. 

