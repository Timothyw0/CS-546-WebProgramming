(function($) {
    const form = $('#search-form');
    const alcohol = $('#alcohol');
    const errors = $('#errors');

    form.submit(function(event) {
        if (errors) errors.empty();
        console.log(alcohol[0].value);
        if(!alcohol[0].value || alcohol[0].value.trim().length < 1) {
            event.preventDefault();
            errors.append('<p class=error-item >Invalid Search Term</p>')
            return;
        } 
    });

})(window.jQuery);