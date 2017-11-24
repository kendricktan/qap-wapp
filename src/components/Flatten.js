import React, { Component } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import { Row, Col } from 'react-flexbox-grid'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
]

class FlattenCard extends Component {
  render () {
    return (
      <Card>
        <CardTitle
          title="Flattening Expressions and Statements into Gates"
          subtitle="Converts arbitrary statements and expressions into a sequence of statements (a.k.a Logic gates)."
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
            These sequence of statements are of two forms:<br />
          <ul>
            <li>
              <code>x = y</code> (where <code>y</code> can be a variable or a number)
            </li>
            <li>
              <code>x = y (op) z</code> (where <code>op</code> can be +, -, *, / and <code>y</code> and <code>z</code> can be variables, numbers, or sub-expression)
            </li>
          </ul>
        </CardText>
        <CardText>
          <Row>
            <Col xs={5}>
              <div style={{ width: '100%' }}> <TextField style={{ width: '75%' }} hintText="y = x * x" /> <FlatButton style={{ width: '10%' }} label="Remove" secondary={true} /> </div>
              <div style={{ width: '100%' }}> <TextField style={{ width: '75%' }} hintText="y = x * x" /> <FlatButton style={{ width: '10%' }} label="Remove" secondary={true} /> </div>
              <div style={{ width: '100%' }}> <TextField style={{ width: '75%' }} hintText="y = x * x" /> <FlatButton style={{ width: '10%' }} label="Remove" secondary={true} /> </div>
              <br />
              <FlatButton fullWidth={true} label="Add Expression" primary={true} />
            </Col>
            <Col xs={7}>
              <ResponsiveContainer height='100%' width='100%' aspect={4.0 / 3.0}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line name="pv of pages" type="monotone" dataKey="pv" stroke="#8884d8" />
                  <Line name="uv of pages" type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </CardText>
      </Card>
    )
  }
}

export default FlattenCard
