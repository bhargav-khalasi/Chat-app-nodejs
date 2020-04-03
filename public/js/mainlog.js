$(document).ready(function()
{
    $('#login-form').validate({
        rules:{
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
            email : 'Enter a valid email',
            pass:{
                minlength: 'Password must be at least 5 characters long'
            }
        },
        submitHandler: function(form){
            localStorage.setItem("user_name",$("input[name=email]").val());
            form.submit();
        }
    });
});