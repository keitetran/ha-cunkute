/**
 * Project Name: ha-cunkute
 * Description: Home Assistant with WebSocket by Keite Tran
 * Creator: Tran Ngoc Anh - VietVbb Team (Keite)
 * Email: mr.ngocanhtran.com@gmail.com
 * HomePage: https://facebook.com/mr.ngocanhtran
 */

var service = (function () {
  "use strict";

  // Update main light brightness
  // ------------------------------
  var updateMainLightBrightness = function (brightness) {
    var percentBr = $('.lightBrightness');
    switch (parseInt(brightness)) {
      case 1:
        percentBr.val('20%');
        break;
      case 2:
        percentBr.val('40%');
        break;
      case 3:
        percentBr.val('60%');
        break;
      case 4:
        percentBr.val('80%');
        break;
      case 5:
        percentBr.val('100%');
        break;
      default:
        break;
    }
  };
  return {

    // Connect to Hass socket API
    // ------------------------------
    ws: "",
    connectToService: function () {
      service.ws = new WebSocket('ws://' + config.hass_server + ':' + config.hass_port + '/api/websocket');
    },

    // Call hass service
    // ------------------------------
    callHaService: function (entity_id, state) {
      var entityArr = entity_id.split('.');
      if (entityArr.length !== 2) return;

      var _service = state;
      if (entityArr[0] === 'switch' || entityArr[0] === 'input_boolean') {
        _service = "turn_" + state;
      }

      service.ws.send(JSON.stringify({
        id: config.api_id.identifier++,
        type: 'call_service',
        domain: entityArr[0],
        service: _service,
        service_data: {
          entity_id: entity_id
        }
      }));
      app.log('Called service: ' + entityArr[0] + '.' + _service + ' ' + entity_id + ' ' + state);
    },


    // Get all states
    // ------------------------------
    getAllStates: function () {
      this.ws.send(JSON.stringify({
        "id": config.api_id.get_states,
        "type": "get_states"
      }));
      app.log('Get all state....');
    },

    // Quick update html switch
    // ------------------------------
    updateHtmlSwithByEntityId: function (entity_id, state) {
      app.setSwitchBtnState($(".chk-input[data-field=state][data-device='" + entity_id + "']"), state);
    },

    // Get all states
    // ------------------------------
    updateAllState: function (device) {
      if ($.isEmptyObject(device)) {
        return;
      }

      var mainLightCtrl = $('main-light-ctrl');
      var mainLightModal = $('main-light-modal');
      var airconCtrl = $('aircon-ctrl');
      var airconModal = $('aircon-modal');
      var toiletCtrl = $('toilet-ctrl');
      var amplyCtrl = $('amply-ctrl');
      var barthroomCtrl = $('bathroom-ctrl');
      var pcCtrl = $('pc-ctrl');
      var sleepModeCtr = $('sleepmode-ctrl');
      var sensorWidget = $('sensor-detail-widget');
      var infoWidget = $('info-widget');

      switch (device.entity_id) {
        case config.entity_id.sensor.dht_sensor_temperature: // Update sensor temperature
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          sensorWidget.find('.temperature .value').html(device.state + 'ºC');
          break;

        case config.entity_id.sensor.dht_sensor_humidity: // Update sensor humidity
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          sensorWidget.find('.humidity .value').html(device.state + '%');
          break;

        case config.entity_id.device_tracker.pc: // Track PC state  
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          service.updateHtmlSwithByEntityId(device.entity_id, (device.state == 'home') ? config.const.on : config.const.off);
          pcCtrl.find('.block').removeClass('disabled');
          break;

        case config.entity_id.input_boolean.system_sleep_mode: // Sleep mode
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          sleepModeCtr.find('.block').removeClass('disabled');

          infoWidget.find('div.item[data-entity="' + config.entity_id.input_boolean.system_sleep_mode + '"]').attr('data-state', device.state);

          break;

        case config.entity_id.switch.front_light: // Front light
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          var frontDoor = $('front-light-ctrl');
          frontDoor.find('.block').removeClass('disabled');
          if (device.state === config.const.on) {
            frontDoor.find('.icon img').attr('src', 'assets/svg/lamp-on.svg');
          } else {
            frontDoor.find('.icon img').attr('src', 'assets/svg/lamp-off.svg');
          }
          break;

        case config.entity_id.switch.main_light_power: // Main light
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          mainLightCtrl.find('.block').attr('data-toggle', 'modal').removeClass('disabled');
          if (device.state === config.const.on) {
            mainLightCtrl.find('.row>.icon img').attr('src', 'assets/svg/chandelier-on.svg');
            mainLightModal.find('.grayPanel').hide();
          } else {
            mainLightModal.find('.grayPanel').show().find('.alert').html(config.lang.device_off_message);
            mainLightCtrl.find('.row>.icon img').attr('src', 'assets/svg/chandelier-off.svg');
          }
          break;

        case config.entity_id.switch.main_light_sleep: // Main light sleep
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          mainLightCtrl.find('.block').attr('data-toggle', 'modal').removeClass('disabled');
          if (device.state === config.const.on) {
            mainLightCtrl.find('.decBlock .icon').removeClass('hidden');
            break;
          }
          mainLightCtrl.find('.decBlock .icon').addClass('hidden');
          break;

        case config.entity_id.input_number.main_light_brightness: // Main light brightness
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          updateMainLightBrightness(device.state);
          break;

        case config.entity_id.switch.aircon_power_off: // Air conditioner => power
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          airconCtrl.find('.block').attr('data-toggle', 'modal').removeClass('disabled');
          if (device.state === config.const.on) {
            airconModal.find('.grayPanel').hide();
          } else {
            airconModal.find('.grayPanel').show().find('.alert').html(config.lang.device_off_message);
          }
          break;

        case config.entity_id.switch.aircon_mode_dry: // Air conditioner => mode dry
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          break;

        case config.entity_id.switch.aircon_mode_cool: // Air conditioner => mode cool
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          break;

        case config.entity_id.switch.aircon_mode_heat: // Air conditioner => mode heat
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          break;


        case config.entity_id.switch.amply_power: // Amply
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          amplyCtrl.find('.block').attr('data-toggle', 'modal').removeClass('disabled');
          break;

        case config.entity_id.switch.toilet_light: // Toilet light
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          toiletCtrl.find('.block').attr('data-toggle', 'modal').removeClass('disabled');
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          if (device.state === config.const.on) {
            toiletCtrl.find('.icon.light').removeClass('hidden');
          } else {
            toiletCtrl.find('.icon.light').addClass('hidden');
          }
          break;

        case config.entity_id.switch.toilet_fan: // Toilet fan
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          toiletCtrl.find('.block').attr('data-toggle', 'modal').removeClass('disabled');
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          if (device.state === config.const.on) {
            toiletCtrl.find('.icon.fan').removeClass('hidden');
          } else {
            toiletCtrl.find('.icon.fan').addClass('hidden');
          }
          break;

        case config.entity_id.switch.barthroom_light: // Barthroom
          app.log('Updated state: ' + device.entity_id + ' ' + device.state);
          barthroomCtrl.find('.block').attr('data-toggle', 'modal').removeClass('disabled');
          service.updateHtmlSwithByEntityId(device.entity_id, device.state);
          break;

        default:
          break;
      }
    },
  };

})();