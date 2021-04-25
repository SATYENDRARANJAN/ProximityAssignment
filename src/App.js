import React, {useState, useEffect ,useRef} from "react";
import { Bar } from "@nivo/bar";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {getColor,getDate}  from "./utils.js"
import styled from 'styled-components'

const client = new W3CWebSocket('ws://city-ws.herokuapp.com/');
 
var moment = require('moment');



const BarComponent = (props) => {
  return (
    <g transform={`translate(${props.x},${props.y})`}>
      <rect
        x={-3}
        y={7}
        width={props.width}
        height={props.height}
        fill="rgba(0, 0, 0, .07)"
      />
      <rect width={props.width} height={props.height} fill={props.color} />
      <rect
        x={props.width - 5}
        width={5}
        height={props.height}
        fill={props.borderColor}
        fillOpacity={0.2}
      />
      <text
        x={props.width - 16}
        y={props.height / 2 - 8}
        textAnchor="end"
        dominantBaseline="central"
        fill="black"
        style={{
          fontWeight: 900,
          fontSize: 15
        }}
      >
        🚩
        {props.data.indexValue}
      </text>
      <text
        x={props.width - 16}
        y={props.height / 2 + 10}
        textAnchor="end"
        dominantBaseline="central"
        fill={props.borderColor}
        style={{
          fontWeight: 400,
          fontSize: 13
        }}
      >
        {parseFloat(props.data.value).toFixed(2)}
      </text>
    </g>
  );
};

const responseData =  [
  // Should be passed initial state
];

const AirApp = () => {
  // Initializing websocket on client 
  client.onopen = () => {
    console.log('WebSocket Client Connected');
  };

  // State for city and aqi response,date 
  let [cityaqi_state,setCityaqi_state] = useState([])
  let [dato,setDato] = useState(null)
  let [executing,setExecuting] = useState(false)
  var cityaqi_Ref = useRef();
  var executing_Ref = useRef();
  var dato_Ref = useRef();
  cityaqi_Ref.current=cityaqi_state
  executing_Ref.current=executing
  dato_Ref.current=dato
  var timer=0

  useEffect(async() => {
    // websocket onmessage handler 
    cityaqi_Ref.current= cityaqi_state
    function load(){
      client.onmessage =async(message) => {
        // Check if block is already executing to delay the render
        if(!executing_Ref.current){
          const newT = new Date()
          await setExecuting(true)
          let updated_cityaqi_state = JSON.parse(message.data)

          var filtered_cityaqi_list=cityaqi_Ref.current
          for(let o2 of cityaqi_Ref.current){
            for( let o1 of updated_cityaqi_state){
              if(o2['city'] ==o1['city']){
                filtered_cityaqi_list = await filtered_cityaqi_list.filter((item)=> (item['city']!==o2['city']))
              }
            }
          }
          filtered_cityaqi_list= await filtered_cityaqi_list.concat(updated_cityaqi_state)
          await setCityaqi_state(filtered_cityaqi_list)
          await setDato(newT)
          }
        await setExecuting(false)
        }
      };
      // websocket onclose and onerror handlers
      client.onclose = () => {
        console.log('disconnected')
        // automatically try to reconnect on connection loss
        }

      client.onerror =()=>{
        console.error(
          "Socket encountered error "
        );
        client.close();
      }
    
    load()
  },[executing,setExecuting]);
  
  useEffect(()=>{
    console.log("******* cityaqi_state*********",cityaqi_state)
  },[cityaqi_state,setCityaqi_state])
  
  
  
  // Sorting the bar graph data accroding to AQI values
  const barData = [...cityaqi_state].sort((a, b) => a.aqi - b.aqi);
  return (
    <>
      <Title style={{  }}>
        Air Quality Index in Indian Cities{" "}
        <Strong>
          <br/>
          {dato && getDate(dato).toLocaleString()}
        </Strong>
      </Title>
      <Bar width={800}
        height={700}
        layout="horizontal"
        margin={{ top: 26, right: 120, bottom: 26, left: 60 }}
        data={barData}
        indexBy="city"
        keys={["aqi"]}
        colors={getColor}
        borderColor={{ from: "color", modifiers: [["darker", 2.6]] }}
        enableGridX
        enableGridY={false}
        axisTop={{
          format: "~s"
        }}
        axisBottom={{
          format: "~s"
        }}
        animate={false}
        axisLeft={null}
        padding={0.3}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
        isInteractive={false}
        barComponent={BarComponent}
        motionStiffness={170}
        motionDamping={26}
      />
    </>
  );
};


const Title =styled.h2`
  padding-left: 60px;
  font-weight: 400;
  color: "#5555"
`

const Strong = styled.strong`
  color: "black";
  font-weight: 900 ;
`
export default AirApp