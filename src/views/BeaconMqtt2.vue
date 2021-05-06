<template>
  <div>

    <!-- {{newDataLine}} -->
    <!-- {{schema_json}} -->
    <!-- <b-button @click="test">TEST BUTTON</b-button> -->
<el-row>
  <el-row>
    <el-col :span="2">
        <apexchart :options="chartOptions" :series="series" height="200%"></apexchart>
    </el-col>

    <el-col :span="22">

    <el-collapse v-model="SelectedCollapse">
      <el-collapse-item title="Configuration" name="1">

        <el-card shadow="always" style="margin-bottom:30px;">
          <el-form ref="configForm" hide-required-asterisk size="small" label-position="top" :model="connection">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item prop="host" label="Host">
                  <el-input v-model="connection.host"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="port" label="Port">
                  <el-input v-model.number="connection.port" type="number" placeholder="8083/8084"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="endpoint" label="Mountpoint">
                  <el-input v-model="connection.endpoint" placeholder="/mqtt"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="clientId" label="Client ID">
                  <el-input v-model="connection.clientId"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="username" label="Username">
                  <el-input v-model="connection.username"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="password" label="Password">
                  <el-input v-model="connection.password"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-button
                  type="success"
                  size="small"
                  class="conn-btn"
                  style="margin-right: 20px;"
                  :disabled="client.connected"
                  @click="createConnection"
                >
                  {{ client.connected ? 'Connected' : 'Connect' }}
                </el-button>

                <el-button v-if="client.connected" type="danger" size="small" class="conn-btn" @click="destroyConnection">
                  Disconnect
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>


    <el-collapse-item title="Subscribe" name="2">
    <el-card shadow="always" style="margin-bottom:30px;">
      <div class="emq-title">
      </div>
      <el-form ref="subscription" hide-required-asterisk size="small" label-position="top" :model="subscription">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="topic" label="Topic">
              <el-input v-model="subscription.topic"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qos" label="QoS">
              <el-select v-model="subscription.qos">
                <el-option
                  v-for="(item, index) in qosList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              :disabled="!client.connected"
              type="success"
              size="small"
              class="subscribe-btn"
              @click="doSubscribe"
            >
              {{ subscribeSuccess ? 'Subscribed' : 'Subscribe' }}
            </el-button>
            <el-button
              :disabled="!client.connected"
              type="success"
              size="small"
              class="subscribe-btn"
              style="margin-left:20px"
              @click="doUnSubscribe"
              v-if="subscribeSuccess"
            >
              Unsubscribe
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    </el-collapse-item>
    

    <el-collapse-item title="Publish" name="3">
      <el-card shadow="always" style="margin-bottom:30px;">
        <div class="emq-title">
        </div>
        <el-form ref="publish" hide-required-asterisk size="small" label-position="top" :model="publish">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="topic" label="Topic">
                <el-input v-model="publish.topic"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="payload" label="Payload">
                <el-input v-model="publish.payload" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="qos" label="QoS">
                <el-select v-model="publish.qos">
                  <el-option
                    v-for="(item, index) in qosList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-col :span="24">
          <el-button :disabled="!client.connected" type="success" size="small" class="publish-btn" @click="doPublish">
            Publish
          </el-button>
        </el-col>
      </el-card>
    </el-collapse-item>

    


      <el-collapse-item title="iBeacon RSSI strength" name="6">
        <el-card shadow="always" style="margin-bottom:30px;">
          <div class="emq-title">
          </div>
          <el-col :span="24">

            <el-input placeholder="" v-model="rssi[0]">
              <template slot="prepend">Display Room</template>
            </el-input>
            <el-input placeholder="" v-model="rssi[1]">
              <template slot="prepend">Bath Room</template>
            </el-input>
            <el-input placeholder="" v-model="rssi[2]">
              <template slot="prepend">Bed Room</template>
            </el-input>
            <el-input placeholder="" v-model="rssi[3]">
              <template slot="prepend">Living Room</template>
            </el-input>
            <el-input placeholder="" v-model="rssi[4]">
              <template slot="prepend">Kitchen</template>
            </el-input>
            
          </el-col>
        </el-card>
      </el-collapse-item>

      <el-collapse-item title="Receive" name="4">
        <el-card shadow="always" style="margin-bottom:30px;">
          <div class="emq-title">
          </div>
          <el-col :span="24">
            <el-input type="textarea" :rows="3" style="margin-bottom: 15px" v-model="newDataLine"></el-input>
          </el-col>
        </el-card>
      </el-collapse-item>

      <el-collapse-item title="Thing Description" name="5">
        <el-card shadow="always" style="margin-bottom:30px;">
          <div class="emq-title">
          </div>
          <el-col :span="24">
            <el-input type="textarea" :rows="3" style="margin-bottom: 15px" v-model="schema_str" height="500%"></el-input>
          </el-col>
        </el-card>
      </el-collapse-item>
      


    </el-collapse>

    

    <el-divider></el-divider>

  </el-col>

  

  </el-row>

  

  





<el-row>
  
  <!-- <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <v-image :config="{
            image: image
          }"/>
          <v-circle :config="circle"
      />
    </v-layer>
  </v-stage> -->
  

  <el-col :span="4">
  <el-row>
    <el-col :span="1">
       <h2>(6,1)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[30]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(5,1)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[24]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(4,1)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[18]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(3,1)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[12]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(2,1)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[6]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(1,1)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[0]" height="100%"></apexchart>
    </el-col>
  </el-row>
  </el-col>

  <el-col :span="4">
  <el-row>
    <el-col :span="1">
       <h2>(6,2)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[31]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(5,2)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[25]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(4,2)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[19]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(3,2)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[13]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(2,2)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[7]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(1,2)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[1]" height="100%"></apexchart>
    </el-col>
  </el-row>
  </el-col>

  <el-col :span="4">
  <el-row>
    <el-col :span="1">
       <h2>(6,3)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[32]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(5,3)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[26]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(4,3)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[19]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(3,3)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[14]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(2,3)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[8]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(1,3)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[2]" height="100%"></apexchart>
    </el-col>
  </el-row>
  </el-col>

  <el-col :span="4">
  <el-row>
    <el-col :span="1">
       <h2>(6,4)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[33]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(5,4)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[27]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(4,4)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[20]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(3,4)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[15]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(2,4)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[9]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(1,4)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[3]" height="100%"></apexchart>
    </el-col>
  </el-row>
  </el-col>

  <el-col :span="4">
  <el-row>
    <el-col :span="1">
       <h2>(6,5)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[34]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(5,5)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[28]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(4,5)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[21]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(3,5)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[16]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(2,5)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[10]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(1,5)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[4]" height="100%"></apexchart>
    </el-col>
  </el-row>
  </el-col>

  <el-col :span="4">
  <el-row>
    <el-col :span="1">
       <h2>(6,6)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[35]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(5,6)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[29]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(4,6)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[22]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(3,6)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[17]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(2,6)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[11]" height="100%"></apexchart>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="1">
       <h2>(1,6)</h2>
    </el-col>
    <el-col :span="23">
      <apexchart :options="chartOptions2" :series="series2[5]" height="100%"></apexchart>
    </el-col>
  </el-row>
  </el-col>
  
  
  <!-- <apexchart :options="chartOptions2" :series="series2[1]" height="400%"></apexchart> -->
</el-row>



</el-row>
  </div>
</template>

<script>
const width = window.innerWidth;
const height = window.innerHeight;
import mqtt from 'mqtt'
// import { setInterval } from 'timers';
const ab2str = require('arraybuffer-to-string');
const SCHMEA_URL = "http://noah-sub1.duckdns.org:8080/cushion.json";
const MQTT_BROKER_URL = "noah-sub1.duckdns.org"
const MQTT_BROKER_PORT = "1883"
const WS_BROKER_PORT = "8084"



// import {CRS,latLng} from "leaflet";
// import {LImageOverlay, LMap, LCircleMarker} from 'vue2-leaflet';

// import VueApexCharts from 'vue-apexcharts'
// import coap  from 'coap' // or coap



export default {
  name: 'Home',

  components:{
    // MqttMap
    // LImageOverlay,
    // LMap,
    // LCircleMarker
  },

  created(){


    // console.log("ddd",this.series2[0])


    this.axios.get(SCHMEA_URL).then((response) => {
        console.log(response.data)
        this.schema_json = response.data;
        this.schema_str = JSON.stringify(this.schema_json, null, 2);
        
    })
    const image = new window.Image();
    image.src = "http://noah-sub1.duckdns.org:8080/livinglab.png";
    image.onload = () => {
      // set image only when it is loaded
      this.image = image;
    };

    // this.$options.sockets.onmessage = (data) => { 
    //   this.Coap_data = data.data;
    //   // console.log(this.Coap_data) 
    //   }

    // this.WSRequest()
  },
  


  data() {
    return {
      array_data : [],




      img : "http://noah-sub1.duckdns.org:8080/livinglab.png",
       stageSize: {
        width: width,
        height: height
      },
      image: null,
      circle:{
          x: 330,
          y: 250,
          radius: 10,
          fill: 'red'
        },

        rssi:[0,0,0,0,0],


      SelectedCollapse: null,
      schema_json : null,
      schema_str : null,

      series: [{
          name: '1',
          data: [0,0,0,0,0,0]
        }, {
          name: '2',
          data: [0,0,0,0,0,0]
        }, {
          name: '3',
          data: [0,0,0,0,0,0]
        }, {
          name: '4',
          data: [0,0,0,0,0,0]
        }, {
          name: '5',
          data: [0,0,0,0,0,0]
        }, {
          name: '6',
          data: [0,0,0,0,0,0]
        }],

        chartOptions: {
            chart: {
              // height: "50%",
              type: 'heatmap',
            },
            plotOptions: {
              heatmap: {
                shadeIntensity: 0.5,
                radius: 0,
                useFillColorAsStroke: true,
                colorScale: {
                  ranges: [ 
                    {from: -10, to: 600, name: '11', color: '#000000' },
                    {from: 601, to: 700, name: '10', color: '#000033' },
                    {from: 701, to: 800, name: '9', color: '#000066' },
                    {from: 801, to: 950, name: '8', color: '#000099' },
                    {from: 951, to: 1150, name: '7', color: '#0000cc' },
                    {from: 1151, to: 1300, name: '6', color: '#0000ff' },
                    {from: 1301, to: 1550, name: '5', color: '#3333ff' },
                    {from: 1551, to: 1800, name: '4', color: '#6666ff' },
                    {from: 1801, to: 2200, name: '3', color: '#9999ff' },
                    {from: 2201, to: 2700, name: '2', color: '#ccccff' },
                    {from: 2701, to: 4100, name: '1', color: '#ffffff' }
                  ]
                }
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: 1
            },
            title: {
              text: 'Cushion heatmap'
            },
          },


          chartOptions2: {
            chart: {
              // height: "50%",
              type: 'line',
            },
            yaxis: {
              max:2200,
              min:450,
              
              // logarithmic: true,
            },
            

            plotOptions: {
              
            },
            dataLabels: {
              // enabled: false
            },
            stroke: {
              width: 1
            },
            title: {
              // text: 'line chart'
            },
          },

            series2: [
              [{
                name: '1',
                data: []
              }],
              [{
                name: '2',
                data: []
              }],
              [{
                name: '3',
                data: []
              }],
              [{
                name: '4',
                data: []
              }],
              [{
                name: '5',
                data: []
              }],
              [{
                name: '6',
                data: []
              }],
              [{
                name: '7',
                data: []
              }],
              [{
                name: '8',
                data: []
              }],
              [{
                name: '9',
                data: []
              }],
              [{
                name: '10',
                data: []
              }],
              [{
                name: '11',
                data: []
              }],
              [{
                name: '12',
                data: []
              }],
              [{
                name: '13',
                data: []
              }],
              [{
                name: '14',
                data: []
              }],
              [{
                name: '15',
                data: []
              }],
              [{
                name: '16',
                data: []
              }],
              [{
                name: '17',
                data: []
              }],
              [{
                name: '18',
                data: []
              }],
              [{
                name: '19',
                data: []
              }],
              [{
                name: '20',
                data: []
              }],
              [{
                name: '21',
                data: []
              }],
              [{
                name: '22',
                data: []
              }],
              [{
                name: '23',
                data: []
              }],
              [{
                name: '24',
                data: []
              }],
              [{
                name: '25',
                data: []
              }],
              [{
                name: '26',
                data: []
              }],
              [{
                name: '27',
                data: []
              }],
              [{
                name: '28',
                data: []
              }],
              [{
                name: '29',
                data: []
              }],
              [{
                name: '30',
                data: []
              }],
              [{
                name: '31',
                data: []
              }],
              [{
                name: '32',
                data: []
              }],
              [{
                name: '33',
                data: []
              }],
              [{
                name: '34',
                data: []
              }],
              [{
                name: '35',
                data: []
              }],
              [{
                name: '36',
                data: []
              }],
            
            
            
            
            
            ]
            
            ,

          // series2: [],
    
      






      connection: {
        // host: '178.128.79.153',
        host: MQTT_BROKER_URL,
        port: WS_BROKER_PORT,
        endpoint: '/mqtt',
        clean: true, // 保留会话
        connectTimeout: 4000, // 超时时间
        reconnectPeriod: 4000, // 重连时间间隔
        // 认证信息
        clientId: 'mqtt_clinet_01',
        username: 'chanwoong.lee',
        password: 'xxxx',
      },
      subscription: {
        topic: '/cushion/99',
        qos: 0,
      },
      publish: {
        topic: 'topic/instance',
        qos: 0,
        payload: '{ "msg": "Hello, I am browser." }',
      },
      // receiveNews: '',
      newDataLine: '',
      newDataArray:'',
      qosList: [
        { label: 0, value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 },
      ],
      client: {
        connected: false,
      },
      subscribeSuccess: false,
    }
  },
  methods: {
    // WSRequest(){
    //   setInterval(() => {
    //     this.$socket.send("")
    //   }, 500);

    // },

    test(){
        // console.log(this.Coap_data);
        // this.$socket.send("");
       
      




      // const req   = coap.request('coap://localhost/mattress')
      // console.log(req);
      // req.on('response', function(res) {
      // res.pipe(process.stdout)
      // })

      // req.end()
      //   this.axios.get(SCHMEA_URL).then((response) => {
      //   console.log(response.data)
      //   this.schema_json = response.data;
      // })
      // console.log("sdfsdfsdf");
      // console.log(this.SelectedCollapse[1]);
    },


    // 创建连接
    circle_displayroom(){
      this.circle = {
        x: 200,
        y: 130,
        radius: 10,
        fill: 'red'
      }
    },
    circle_bedroom(){
      this.circle = {
        x: 430,
        y: 130,
        radius: 10,
        fill: 'red'
      }
    },
    circle_kitchen(){
      this.circle = {
        x: 420,
        y: 310,
        radius: 10,
        fill: 'red'
      }
    },
    circle_livingroom(){
      this.circle = {
        x: 200,
        y: 300,
        radius: 10,
        fill: 'red'
      }
    },
    circle_bathroom(){
      this.circle = {
        x: 320,
        y: 130,
        radius: 10,
        fill: 'red'
      }
    },
    circle_center(){
      this.circle = {
        x: 330,
          y: 250,
          radius: 10,
          fill: 'red'
      }
    },

    circle_move(){
      var max = Math.max.apply(null, this.rssi);
      var max_index = this.rssi.indexOf(max);
      console.log(max_index);

      if(max_index==0){
        this.circle_displayroom();
      }else if(max_index==1){
        this.circle_bathroom();
      }else if(max_index==2){
        this.circle_bedroom();
      }else if(max_index==3){
        this.circle_livingroom();
      }else if(max_index==4){
        this.circle_kitchen();
      }
    },


    createConnection() {
     
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      try {
        this.client = mqtt.connect(connectUrl, options)
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      this.client.on('connect', () => {
        console.log('Connection succeeded!')
      })
      this.client.on('error', error => {
        console.log('Connection failed', error)
      })
      this.client.on('message', (topic, message) => {         // whenever get data
        // this.receiveNews = this.receiveNews.concat(message)
        this.newDataLine = ab2str(message)
        this.newDataArray = this.newDataLine.split(',')

        var timestamp = this.newDataArray[0];
        var cushion_id = this.newDataArray[1];
        var arr_temp = [];

        var newArray = this.series.slice()
        // var newArray2 = this.series2.slice()

        

        var arr_arr = new Array(6);
        for (var it=0; it<6; it++){
          arr_arr[it] = new Array(6);
        }

        for (var z=0; z<6; z++){
          for(var zt=0; zt<6; zt++){
            // arr_arr[z][zt] = 
            //     [{
            //       name: '1',
            //       data: [2000]
            //     }]
            // arr_arr[z][zt] = this.series2[(z*6)+zt].slice()
            arr_arr[z][zt] = this.series2[(z*6)+zt].slice()
          }
        }
        

      for(var j=0 ; j<6 ; j++){
          for(var k=0; k<6; k++){
            // newArray[j].data[k] =  Math.floor(Math.random() * (max - min + 1));
            newArray[j].data[k] = this.newDataArray[(j*6)+k+2];
            arr_temp.push( {"properties": {"current": newArray[j].data[k], "coord":{"properties": {"x":k, "y":j}} } } );
            // if(j==0 && k==0){newArray2[0].data.push(this.newDataArray[(j*6)+k+2]); }
            arr_arr[j][k][0].data.push(Number(this.newDataArray[(j*6)+k+2]));
           
          }
      }
      
      // console.log(arr_arr[0][1][0].data);

      for(var ia=0; ia<6; ia++){
        for(var ib=0; ib<6; ib++){
          
          this.series2[(ia*6)+ib] = arr_arr[ia][ib];
          if(this.series2[(ia*6)+ib][0].data.length>15){this.series2[(ia*6)+ib][0].data.shift()}
        }
      }
      // console.log(this.series2[0][0].data.length)

      // this.series2[0] = arr_arr[0][1];


      this.series = newArray;
      // this.series2 = newArray2;



      for (var i=0 ; i<5; i++){
        this.rssi[i] = Number(this.newDataArray[38+i]);
        if(Number(this.newDataArray[38+i])==0){
          this.rssi[i] = -100;
        }
      }
      // console.log(this.rssi);
      // this.circle_move(this.rssi);

      this.circle_move();
      
      // var test_json = [
      //   {"properties": {"current": 1234, "coord":{"properties": {"x":1, "y":2}} } },
      //   {"properties": {"current": 5555, "coord":{"properties": {"x":6, "y":5}} } } 
      
      // ];
      if(Number(this.SelectedCollapse[1]) == 5){
      this.schema_json["events"]["pressure"]["data"]["items"]["properties"]["points"]["data"] = arr_temp;
      this.schema_json["events"]["pressure"]["data"]["items"]["properties"]["time"]["data"]=timestamp;
      this.schema_json["events"]["pressure"]["forms"][0]["href"] = "mqtt//:"+MQTT_BROKER_URL+":"+MQTT_BROKER_PORT+"/"+cushion_id;
      this.schema_str = JSON.stringify(this.schema_json, null, 2);
      }
      // this.schema_json["events"]["pressure"]["data"]["items"]["properties"]["points"][""]
    
      

        
        // for(var i=0; i<435; i++){
        //   // this.series[Math.floor((i/29))]["data"][i%15] = Number(this.newDataArray[i+2])
        //   // console.log(this.series[0]["data"][0])
        //   // if(i==424){console.log(Number(this.newDataArray[i+2]))}
        //   // console.log(Math.floor((i/15)))
        //   // console.log((i%29))
        // }
        
        // console.log(this.series[0]["data"][0])
        // this.series[0]["data"][0] = Number(deviceID)


        // this.receiveNews = message
        // console.log(`Received message ${message} from topic ${topic}`)
      })
    },
    // 订阅主题
    doSubscribe() {
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('Subscribe to topics res', res)
      })
    },
    // 取消订阅
    doUnSubscribe() {
      const { topic } = this.subscription
      this.client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
        }
      })
    },
    // 发送消息
    doPublish() {
      const { topic, qos, payload } = this.publish
      this.client.publish(topic, payload, qos, error => {
        if (error) {
          console.log('Publish error', error)
        }
      })
    },
    // 断开连接
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end()
          this.client = {
            connected: false,
          }
          console.log('Successfully disconnected!')
        } catch (error) {
          console.log('Disconnect failed', error.toString())
        }
      }
    },
  },
}
</script>

<style>

</style>
