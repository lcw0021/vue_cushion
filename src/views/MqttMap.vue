<template>
  <dev>
    <!-- <button @click="test">test</button> -->
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <v-image :config="{
            image: image
          }"/>
          <v-circle :config="circle"
      />
    </v-layer>
  </v-stage>
  </dev>
</template>

<script>
const width = window.innerWidth;
const height = window.innerHeight;


import mqtt from 'mqtt'
// import { setInterval } from 'timers';
const ab2str = require('arraybuffer-to-string');
const SCHMEA_URL = "http://161.122.38.142:8080/mattress.json";
const MQTT_BROKER_URL = "161.122.38.142"
const MQTT_BROKER_PORT = "1883"
const WS_BROKER_PORT = "8083"


// import VueApexCharts from 'vue-apexcharts'
// import coap  from 'coap' // or coap
    


export default {
  name: 'Home',

  components:{
  
  },

  created(){
    this.axios.get(SCHMEA_URL).then((response) => {
        console.log(response.data)
        this.schema_json = response.data;
        this.schema_str = JSON.stringify(this.schema_json, null, 2);
    })

    const image = new window.Image();
    image.src = "http://161.122.38.142:8080/livinglab.png";
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
      img : "http://161.122.38.142:8080/livinglab.png",
      stageSize: {
        width: width,
        height: height
      },
      image: null,

      circle:{
          x: 800,
          y: 400,
          radius: 10,
          fill: 'red'
        },

      rssi=[0,0,0,0,0],
      
      

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
        topic: '/cushion/7',
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
      this.circle = {
          x: 800,
          y: 400,
          radius: 10,
          fill: 'red'
      }
        
    },


    // 创建连接

    drawCircle(arr){
      this.circle = {
          x: 400,
          y: 100,
          radius: 10,
          fill: 'red'
      }
    },

    createConnection() {
      
      // 连接字符串, 通过协议指定使用的连接方式
      // ws 未加密 WebSocket 连接
      // wss 加密 WebSocket 连接
      // mqtt 未加密 TCP 连接
      // mqtts 加密 TCP 连接
      // wxs 微信小程序连接
      // alis 支付宝小程序连接
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
      this.client.on('message', (topic, message) => {
        // this.receiveNews = this.receiveNews.concat(message)
        this.newDataLine = ab2str(message)
        this.newDataArray = this.newDataLine.split(',')

        var timestamp = this.newDataArray[0];
        var cushion_id = this.newDataArray[1];
        var arr_temp = [];

        var newArray = this.series.slice()
      for(var j=0 ; j<6 ; j++){
          for(var k=0; k<6; k++){
            // newArray[j].data[k] =  Math.floor(Math.random() * (max - min + 1));
            newArray[j].data[k] = this.newDataArray[(j*6)+k+2];
            arr_temp.push( {"properties": {"current": newArray[j].data[k], "coord":{"properties": {"x":k, "y":j}} } } );
          }
      }
      
      for (var i=0 ; i<5; i++){
        this.rssi[i] = Number(this.newDataArray[38+i]);
      }
      console.log(rssi);
      this.series = newArray;

      
      




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

<style lang="scss">

$inputFontSize : 16px;

.el-textarea {
  textarea {
    height: 400px;
  }
}

@import url('../assets/style/home.scss');

.home-container {
  max-width: 1100px;
  margin: 0 auto;

  .conn-btn {
    color: #fff;
    background-color: #00b173;
    font-size: 14px;
  }

  .publish-btn {
    margin-bottom: 20px;
    float: right;
  }

  .el-button--success {
    background-color: #34c388 !important;
    border-color: #34c388 !important;
    font-size: 14px !important;
  }

  .el-button--danger {
    background-color: #f5222d !important;
    border-color: #f5222d !important;
  }

  .el-form-item {
    &.is-error {
      .el-input__inner,
      .el-textarea__inner {
        box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
      }
    }
    &.is-success {
      .el-input__inner,
      .el-textarea__inner {
        border-color: #34c388 !important;
      }
    }
  }
}
</style>
