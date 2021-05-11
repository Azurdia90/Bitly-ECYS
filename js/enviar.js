/* proxy */

var shortenUrl = function(longUrl){
    return $.Deferred(function(defer){
        
        var data = {
            "long_url": longUrl,
            "domain": "bit.ly", 
            "group_guid": bitly_login
        };

        $.ajax({
            url: bitly_url,
            method: "POST",
            dataType: 'json',
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + bitly_apiKey);
            },
            data: JSON.stringify(data)
        }).done(function(data) {
            console.log(data);
            var result = data['link'];
            document.getElementById("shorturl").value = "link : " + result;
        }).fail(function(data) {
            console.log(data);
            var state = data['statusText'];
            var messageerror = JSON.parse(data['responseText']);
            console.log(messageerror);
            messageerror = messageerror['description'];
            document.getElementById("shorturl").value = state + ': ' + messageerror;
        });

        function reject(){
            defer.reject({ msg: 'bit.ly got problem' });
        }
    }).promise();
};


/* DOM things */

$(function(){

    var $longUrl = $('#longurl');
    var $button = $('#buttonurl');
    var $shorturl = $('#shorturl');

    $button.click(function(){
        var longUrl = $longUrl.val();
        if(longUrl === ''){
            return;
        }
        shortenUrl(longUrl).then(function(shortUrl){
            $shorturl.value = shortUrl;
        }, function(){
            $shorturl.value = 'bit.ly may be offline';
        });
    });

});