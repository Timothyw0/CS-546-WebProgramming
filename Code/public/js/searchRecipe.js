(function($) {
    const form = $('#search-form');
    const alcohol = $('#alcohol');
    const errors = $('#errors');

    form.submit(function(event) {
        if ($('error')) $('error').remove();
        if (errors) errors.remove();
        console.log(alcohol[0].value);
        if(!alcohol[0].value || alcohol[0].value.trim().length < 1) {
            event.preventDefault();
            form.append('<p class=error >Invalid Search Term</p>')
            return;
        } 
    });

})(window.jQuery);