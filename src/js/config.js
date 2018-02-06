/**
 * Project Name: ha-cunkute
 * Description: Home Assistant with WebSocket by Keite Tran
 * Creator: Tran Ngoc Anh - VietVbb Team (Keite)
 * Email: mr.ngocanhtran.com@gmail.com
 * HomePage: https://facebook.com/mr.ngocanhtran
 */

// Settings
// ------------------------------
var config = (function () {
  "use strict";
  return {
    debug: true,
    api_id: {
      subscribe_events: 1,
      get_states: 2,
      identifier: 10
    },
    passphrase: "7IeZlmfz123",
    weather_code: 1117099,
    hass_server: 'myhome.local',
    //hass_server: 'localhost',
    hass_port: '8123',
    const: {
      on: "on",
      off: "off",
      decrement: 'decrement',
      increment: 'increment'
    },
    entity_id: {
      switch: {
        front_light: 'switch.front_light',
        main_light_power: 'switch.main_light_power',
        // main_light_power: 'input_boolean.people_in_toilet',
        main_light_sleep: 'switch.main_light_sleep',
        main_light_brightness: 'switch.main_light_brightness',
        amply_power: 'switch.amply_power',
        toilet_light: 'switch.toilet_light',
        toilet_fan: 'switch.toilet_fan',
        barthroom_light: 'switch.barthroom_light',
        aircon_power_off: 'switch.aircon_power_off',
        aircon_mode_cool: 'switch.aircon_mode_cool',
        aircon_mode_dry: 'switch.aircon_mode_dry',
        aircon_mode_heat: 'switch.aircon_mode_heat'
      },
      input_boolean: {
        system_sleep_mode: 'input_boolean.system_sleep_mode',
        information_messages: 'input_boolean.information_messages'
      },
      input_number: {
        main_light_brightness: 'input_number.main_light_brightness'
      },
      sensor: {
        dht_sensor_temperature: 'sensor.dht_sensor_temperature',
        dht_sensor_humidity: 'sensor.dht_sensor_humidity'
      },
      device_tracker: {
        pc: 'device_tracker.pc'
      }
    },
    aircon: {
      temp_max: 32,
      temp_min: 15
    },
    lang: {
      device_off_message: 'Thiết bị đang tắt, hãy bật để điều chỉnh.',
      confirm_message: 'Bạn có chắc chắn không ?'
    }
  };
})();