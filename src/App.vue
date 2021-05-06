<template>
  <div id="app">
    <!-- <updateChart></updateChart> -->

    <el-tabs>
      <!-- <el-tab-pane label="MQTT">
        <MqttView msg="Welcome to Your Vue.js App"/>
      </el-tab-pane>

      <el-tab-pane label="CoAP">
        <CoapView/>
      </el-tab-pane> -->

      <el-tab-pane label="CushionPhone">
        <CushionPhone/>
      </el-tab-pane>

      <el-tab-pane label="IBeacon2">
        <BeaconMqtt2/>
      </el-tab-pane>

      
      
    </el-tabs>




  </div>
</template>

<script>
// import MqttView from './views/MqttView.vue'
// import CoapView from './views/CoapView.vue'
import CushionPhone from './views/CushionPhone.vue'
import BeaconMqtt2 from './views/BeaconMqtt2.vue'
// import updateChart from './views/updatechart.vue'

export default {
  name: 'App',
  components: {
    // MqttView,
    // CoapView,
    CushionPhone,
    BeaconMqtt2
    // updateChart
  }
}
</script>

<style>

</style>
