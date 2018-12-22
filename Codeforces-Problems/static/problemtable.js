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