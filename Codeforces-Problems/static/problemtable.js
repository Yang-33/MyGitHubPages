jQuery(function ($) {
            $("#tablelist").DataTable({
              "lengthChange": false,
               "lengthMenu": [[-1], ["All"]],
                     "info": false,
                   "paging": false,
                    "order": [ [ 2, "desc" ] ],
                 "language": {"search": "Search:"}
                 });
        });

/* Custom filtering function which will search data in column four between two values */
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = parseInt( $('#mindiff').val(), 10 );
        var max = parseInt( $('#maxdiff').val(), 10 );
        var age = parseFloat( data[1] ) || 0; // use data for the age column
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && age <= max ) ||
             ( min <= age   && isNaN( max ) ) ||
             ( min <= age   && age <= max ) )
        {
            return true;
        }
        return false;
    }
);

$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = parseInt( $('#minsolve').val(), 10 );
        var max = parseInt( $('#maxsolve').val(), 10 );
        var age = parseFloat( data[2] ) || 0; // use data for the age column
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && age <= max ) ||
             ( min <= age   && isNaN( max ) ) ||
             ( min <= age   && age <= max ) )
        {
            return true;
        }
        return false;
    }
); 

$(document).ready(function() {
    var table = $('#tablelist').DataTable();

    // Event listener to the two range filtering inputs to redraw on input 1
    $('#mindiff, #maxdiff').keyup( function() {
        table.draw();
    } );
    // Event listener to the two range filtering inputs to redraw on input 2
    $('#minsolve, #maxsolve').keyup( function() {
        table.draw();
    } );
} );

