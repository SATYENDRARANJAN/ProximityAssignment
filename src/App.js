import React, {useState, useEffect } from "react";
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
  const [cityaqi_state,setCityaqi_state] = useState([])
  const [dato,setDato] = useState(null)
  const [executing,setExecuting] = useState(false)
  var timer=0

  useEffect(async() => {
    // websocket onmessage handler 
      client.onmessage =async(message) => {
        // Check if block is already executing to delay the render
        if(!executing){
          const newT = new Date()
          await setExecuting(true)
          if (dato== null  || ((new Date()-dato)>4000)){
                await setCityaqi_state( await( JSON.parse(message.data)));
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
  },[]);
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