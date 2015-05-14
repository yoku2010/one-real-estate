$(function() {
    var $form = $("#contact_us_form"),
    fb = new Firebase("https://real-estate-network.firebaseio.com"),
    $errorMsg = $('#error_msg'), $successMsg = $('#success_msg'), timeObj = null;
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
            timeObj && timeObj.clearTimeout();
            for(var d in dataArr) {
                dataJson[dataArr[d]['name']] = dataArr[d]['value'];
            }
            dataJson['t'] = (new Date()).getTime();
            fb.push(dataJson);
            form.reset();
            $errorMsg.hide();
            $successMsg.show();
            timeObj = setTimeout(function() {
                $successMsg.slideUp();
            }, 8000);
        },
        invalidHandler: function (event, validator) {
            $errorMsg.show();
            $successMsg.hide();
        }
    });
});