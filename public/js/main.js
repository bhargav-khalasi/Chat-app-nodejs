$(document).ready(function()
{
    $('#register-form').validate({
        rules:{
            name: {
                required: true,
                minlength: 3,
                maxlength: 30
            },
            email:{
                required: true,
                email: true
            },
            pass:{
                required: true,
                minlength: 5
            }
        },
        messages:{
            name:{
                required: 'Name is required',
                minlength: 'Must be 3 characters long'
            },
            email : 'Enter a valid email',
            pass:{
                minlength: 'Password must be at least 5 characters long'
            }
        },
        submitHandler: function(form){
            form.submit();
        }
    });
});