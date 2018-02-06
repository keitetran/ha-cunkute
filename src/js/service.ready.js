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
    // Show loading component
    // ------------------------------
    app.loadding(true);

    // CHeck token 
    var token = app.getParam('token');

    // Connect to HA service
    service.connectToService();

    // On message come
    // ------------------------------
    service.ws.onmessage = function (event) {
      var evData = $.parseJSON(event.data);
      // app.log('evData', evData);

      // API required password
      if (evData.type === 'auth_required') {
        app.log('Auth required..');

        // Check token
        if (token == undefined || token == "") {
          app.loginModal(true);
          return;
        }

        // Send pasword to HA
        service.ws.send(JSON.stringify({
          type: "auth",
          api_password: app.decryption(token)
        }));
        return;
      }

      // API password invalid
      if (evData.type === 'auth_invalid') {
        app.log(evData.message);
        app.alert('Sai mật khẩu.').then(function (r) {
          if (r) {
            setTimeout(function () {
              window.location.href = 'http://' + window.location.host;
            }, 300);
          }
        });
        return;
      }

      // Send pass result OK
      if (evData.type === 'auth_ok') {

        app.log('Auth ok. Ready to receive new state change..');

        // Hide loadding modal
        app.loginModal(false);

        // Store token to URL 
        if (token == null) {
          var rawPass = app.encryption($('login-modal').find('input[name=txtPassword]').val());
          window.location.href = window.location.href + '?token=' + rawPass;
        }

        // Subscribe to events state_changed
        service.ws.send(JSON.stringify({
          id: config.api_id.subscribe_events,
          type: 'subscribe_events',
          event_type: 'state_changed'
        }));

        // Get all curent state
        service.getAllStates();

        // Get sensor data
        // service.callRestFulApi();
        return;
      }

      // Command result 
      if (evData.type === 'result' && evData.success && evData.result == null) {
        config.api_id.identifier++;
        return;
      }

      // Get all state result
      if (evData.type === 'result' && evData.success && evData.result != null) {
        var allStates = evData.result;
        if ($.isEmptyObject(allStates)) {
          return;
        }
        $.each(allStates, function (index, device) {
          service.updateAllState(device);
        });
        return;
      }

      // HASS event state_changed listener
      if (evData.type === "event" && evData.id === config.api_id.subscribe_events) {
        service.updateAllState(evData.event.data.new_state);
        app.log(evData.event.data.new_state);
        return;
      }

      // Error
      if (!evData.success) {
        //app.error(evData.error.code, evData.error.message);
      }

    };

    // Socket close
    // ------------------------------
    service.ws.onclose = function () {
      app.loadding(true, 'Try reconnecting to HA..');
      app.log('Socket closed');

      // Reconnect to service 
      setTimeout(function () {
        service.connectToService();
        app.log("Try reconnect to HA service...");
      }, 5000);
    };

    // Socket open
    // ------------------------------
    service.ws.onopen = function () {
      app.log('Connected to HA...');
      app.loadding(false, 'Connected to HA...');
    };

    // Socket connection error
    // ------------------------------
    service.ws.onError = function (evt) {
      app.error(evt.data);
      service.ws.close();
    };

    // Login button click
    // ------------------------------
    $("login-modal button[name=btnLogin]").click(function (e) {
      var txtPass = $('login-modal').find('input[name=txtPassword]');
      var pass = txtPass.val();
      if (pass != "") {
        service.ws.send(JSON.stringify({
          type: "auth",
          api_password: pass
        }));
        txtPass.val(pass);
      }
      return e.preventDefault();
    });

    // All switch button change
    // ------------------------------
    $('input.chk-input[type=checkbox]').click(function (e) {
      var device = $(this).data("device");
      var value = app.getSwitchBtnState($(this));
      if (device === null || value === null) return;

      // Confirm on sleep mode change
      if (device === config.entity_id.input_boolean.system_sleep_mode && value === config.const.on) {
        app.confirm(config.lang.confirm_message).then(function (result) {
          if (result.value) service.callHaService(device, value);
        });
        return e.preventDefault();
      }

      // Khong the tat may tinh
      if (device == config.entity_id.device_tracker.pc && value == config.const.off) {
        app.alert('Không thể tắt được máy tính.');
        return e.preventDefault();
      }

      // Aircon turnoff (2 step)
      setTimeout(function () {
        service.callHaService(config.entity_id.switch.aircon_power_off, config.const.off);
      }, 1000);

      // // Aircon turn on _> open popup
      // if (device == config.entity_id.switch.aircon_power_off && value == config.const.on) {
      //   $('aircon-modal').modal('show');

      //   return e.preventDefault();
      // }

      // Call service
      service.callHaService(device, value);

      return e.preventDefault();
    });



    // Air conditioner mode switch
    // ------------------------------
    var airconModal = $('aircon-modal');
    airconModal.find('.airConditionerMode button').click(function (e) {
      var _that = $(this);
      var modeName = _that.find('span').text();
      app.confirm(config.lang.confirm_message).then(function (result) {
        if (result.value) {
          $('.airConditionerMode button').removeClass('active');
          _that.addClass('active');
          app.alert('Đã chuyển sang chế độ <mark>' + modeName + '</mark>', null, null);
        }
      });
      return e.preventDefault();
    });

    // Air conditioner temp change
    // ------------------------------

    // input air temp 
    var airTemp = airconModal.find("input.airTemp");

    // Temp down
    airconModal.find(".btnAirTempDown").click(function (e) {
      var val = airTemp.val();
      val = parseInt(val);
      if (val > config.aircon.temp_min) {
        val = val - 1;
        airTemp.val(val);
      }
      return e.preventDefault();
    });

    // Temp up
    airconModal.find(".btnAirTempUp").click(function (e) {
      var val = airTemp.val();
      val = parseInt(val);
      if (val < config.aircon.temp_max) {
        val = val + 1;
        airTemp.val(val);
      }
      return e.preventDefault();
    });


    // Main light brightness change
    // ------------------------------

    // input light brightness
    var lightBrightness = $("input.lightBrightness");



    // brightness down
    $(".btnLightBrightness.Down").click(function (e) {
      $(this).attr('disabled', 'disabled');
      var val = lightBrightness.val();
      val = val.replace('%', '');
      val = parseInt(val);
      val = parseInt(val);
      if (val > 20) {
        val = val - 20;
        lightBrightness.val(val + '%');
      }

      // Call service
      service.callHaService(config.entity_id.switch.main_light_brightness, config.const.off);

      // Delay time wait for IR command send
      setTimeout(function () {
        $(".btnLightBrightness.Down").removeAttr('disabled');
        service.callHaService(config.entity_id.input_number.main_light_brightness, config.const.decrement);
      }, 1000);
      return e.preventDefault();
    });

    // brightness up
    $(".btnLightBrightness.Up").click(function (e) {
      $(this).attr('disabled', 'disabled');
      var val = lightBrightness.val();
      val = val.replace('%', '');
      val = parseInt(val);
      val = parseInt(val);
      if (val < 100) {
        val = val + 20;
        lightBrightness.val(val + '%');
      }

      // Call service
      service.callHaService(config.entity_id.switch.main_light_brightness, config.const.on);

      // Delay time wait for IR command send
      setTimeout(function () {
        $(".btnLightBrightness.Up").removeAttr('disabled');
        service.callHaService(config.entity_id.input_number.main_light_brightness, config.const.increment);
      }, 1000);
      return e.preventDefault();
    });


  });
})();