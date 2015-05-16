$(function() {
    var $form = $("#contact_us_form"),
    fb = new Firebase("https://real-estate-network.firebaseio.com"),
    $msg = $('#msg');
    $form.validate({
        rules: {
            n: {
                required: true
            },
            e: {
                required: true,
                email: true
            }
        },
        messages: {
            n: {
                required: 'Name is required.'
            },
            e: {
                required: 'Email ID is required.',
                email: 'Please enter valid Email ID.'
            }
        },
        submitHandler: function (form) {
            var dataArr = $(form).serializeArray(), dataJson = {};
            for(var d in dataArr) {
                dataJson[dataArr[d]['name']] = dataArr[d]['value'];
            }
            dataJson['t'] = (new Date()).getTime();
            fb.push(dataJson);
            form.reset();
            $msg.message({
                type: 'success',
                html: 'Your request is submitted successfully.',
                autoHide: 4000
            });
            return false;
        },
        invalidHandler: function (event, validator) {
            $msg.message({
                type: 'danger',
                html: 'Submitted form is invalid.',
                autoHide: 4000
            });
        }
    });
});