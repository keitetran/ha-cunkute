/**
 * Project Name: ha-cunkute
 * Description: Home Assistant with WebSocket by Keite Tran
 * Creator: Tran Ngoc Anh - VietVbb Team (Keite)
 * Email: mr.ngocanhtran.com@gmail.com
 * HomePage: https://facebook.com/mr.ngocanhtran
 */
(function () {
	"use strict";
	$(document).ready(function () {
		var searchtext = "select * from weather.forecast where (woeid = " + config.weather_code + ") AND u='c'";
		$.ajax({
			dataType: "json",
			url: "https://query.yahooapis.com/v1/public/yql?q=" + searchtext + "&format=json",
		}).done(function (results) {
			if ($.isEmptyObject(results)) return;
			var channel = results.query.results.channel;
			var condition = channel.item.condition;
			condition.class = 'wi-yahoo-' + condition.code;
			var forecast = channel.item.forecast;
			$('weather-widget>.row').html('');
			$('weather-widget>.row').append('<div class="col col-sm-12 tday"><div class="row no-gutters"><div class="col-12 col-sm-4 text-center"><span class="text">' + channel.location.city + '</span><i class="wi ' + condition.class + '"></i><span class="temp">' + condition.temp + 'º</span></div><div class="col-sm-8 d-none d-sm-block"><div class="row no-gutters"><div class="col-4 text-center"><i data-feather="sunrise" class=""></i><small>' + channel.astronomy.sunrise + '</small></div><div class="col-4 text-center"><i data-feather="sunset" class=""></i><small>' + channel.astronomy.sunset + '</small></div><div class="col-4 text-center"><i data-feather="droplet" class=""></i><small>' + channel.atmosphere.humidity + '%</small></div></div></div></div></div>');
			for (var i = 1; i <= 6; i++) {
				var avg = Math.round((parseInt(forecast[i].high) + parseInt(forecast[i].low)) / 2);
				$('weather-widget>.row').append('<div class="col-1 col-sm wday"><span class="date">' + forecast[i].day +
					'</span><span class="icon"><i class="wi wi-yahoo-' + forecast[i].code + '"></i></span><span class="temp">' + avg + 'º</span></div>');
			}
			feather.replace();
		}).fail(function (err) {
			console.log(err.message);
		});
	});
})();