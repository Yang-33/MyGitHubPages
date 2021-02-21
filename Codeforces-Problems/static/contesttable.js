        jQuery(function ($) {
            $("#tablelist").DataTable({
              "lengthChange": false,
                 "ordering": false,
                "stateSave": true,
               "lengthMenu": [[-1], ["All"]],
               "columnDefs": [{ targets: 0, width: 200 }],
                     "info": false,
                   "paging": false,
                 "language": {"search": "contest or problem name:"}
            });
        });
