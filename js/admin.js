$(function() {
    var $auth = $('div.auth-section');
    $.fn.extend({
        manageDashboard: function (options) {
            var options = $.extend({

            }, options);
            this.each(function () {
                new $.manageAdminActions(this, options);
            });
            return this;
        }
    });
    $.manageAdminActions = function (me, opt) {
        var md = {
            data: [],
            auth: {},
            $me: $(me),
            timeObj: null,
            fbData: new Firebase('https://real-estate-network.firebaseio.com'),
            fbAuth: new Firebase('https://real-estate-net-auth.firebaseio.com'),
            func: {
                init: function () {
                    md.func.loadAuthData();
                    md.func.contactDataTable();
                },
                checkAuth: function () {
                    return true;
                    if ($.cookie('auth')) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                loadData: function () {
                    md.fbData.on('value', function(snapshot) {
                        var d, dt = snapshot.val(), val;
                        for (d in dt) {
                            val = dt[d];
                            md.data.push([
                                val.n,
                                val.e,
                                val.tp,
                                val.t,
                                val.s,
                                val.m
                            ]);
                        }
                    }, function (errorObject) {
                        console.log('The data failed: ' + errorObject.code);
                    });
                },
                loadAuthData: function () {
                    md.fbAuth.on('value', function(snapshot) {
                        md.auth = $.extend(snapshot.val(), md.auth);
                    }, function (errorObject) {
                        console.log('The auth failed: ' + errorObject.code);
                    });
                },
                goOffline: function () {
                    Firebase.goOffline();
                },
                contactDataTable: function () {
                    // Attach an asynchronous callback to read the data at our posts reference
                    if (md.func.checkAuth()) {
                        // load data
                        md.func.loadData();

                        md.func.loadingDataTable();

                        md.timeObj && md.timeObj.clearTimeout();

                        md.timeObj = setTimeout(function () {
                            md.func.loadDataTable(md.data);
                            md.func.goOffline();
                        }, 5000);
                    }
                    else {
                        md.func.redirectToLogin();
                    }
                },
                loadDataTable: function (dt) {
                    var $table = $('<table></table>').addClass('table table-hover dtable');
                    $('<thead></thead>').appendTo($table);
                    $('<tbody></tbody>').appendTo($table);
                    $table.appendTo(md.$me.empty());
                    $table.dataTable( {
                        'ordering': true,
                        'searching': true,
                        'columns': [
                            {'sTitle':'Name'},
                            {'sTitle':'Email'},
                            {'sTitle':'Telephone'},
                            {'sTitle':'Date'},
                            {'sTitle':'Subject'},
                            {'sTitle':'Message'}
                        ],
                        'data': dt,
                        'columnDefs': [
                            {
                                'render': function ( data, type, row ) {
                                    return (new Date(data)).toGMTString() ;
                                },
                                'targets': 3
                            }
                        ]
                    });
                },
                redirectToLogin: function() {
                    window.location.href = window.location.href;
                },
                loadingDataTable: function () {
                    md.$me.html('Loading...');
                }
            }
        };
        md.func.init();
    }
    $auth.manageDashboard();
});