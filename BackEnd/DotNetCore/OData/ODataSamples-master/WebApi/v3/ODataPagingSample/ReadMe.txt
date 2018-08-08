ODataPagingSample
----------------

This sample illustrates server-driven paging using OData. In particular, it stores a table of
movies in a LocalDB and exposes the table as an OData entity set using ODataController that
derives from ApiController. The controller uses Entity Framework as an object relational
mapper and the client uses Knockout.js for updating the page elements.

The server controls the page size by using the PageSize property on the [Queryable] attribute.
Modifying this value allows the server to change the page size for the client without requiring
any changes to the client itself.

This sample is provided as part of the OData WebApi sample repository at
https://github.com/OData/ODataSamples