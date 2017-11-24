import React, { Component } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import { Row, Col } from 'react-flexbox-grid'
import { displayMatrix } from '../utils/displayMaths'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
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

const vectorDisplayStyle = {
  textAlign: 'center',
  fontSize: '20px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap'
}

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
]

class R1CSToQAPCard extends Component {
  render () {
    return (
      <Card>
        <CardTitle
          title='R1CS to QAP'
          subtitle='Converting the R1Cs to QAP allows us to check all of the constraints at the same time.'
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
            This transformation is achieved using <i>Lagrange Interpolation</i>. <a href="https://www.youtube.com/watch?v=vAgKE5wvR4Y">You can find out more about Lagrange Interpolation here.</a>
        </CardText>
        <CardText>
          <Row style={{textAlign: 'center', fontSize: '25px'}}>
            <Col xs={1}></Col>
            <Col xs={5}>R1CS</Col>
            <Col xs={6}>QAP</Col>
          </Row><br/>
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={1} style={{fontSize: '35px'}}>
                A
            </Col>
            <Col xs={5}>
              <Row middle="xs">
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix([[1596, 2, 3, 4, 5], [6, 74, 8, 9, 10], [11, 12, 13, 14, 15]]) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
            <Col xs={6}>
              <Row middle="xs">
                <Col xs={1} style={{fontSize: '60px', textAlign: 'right'}}>[</Col>
                <Col xs={10}>
                  { displayMatrix([[15.22, 2.34, 3.45], [62.00, 74.88, 8.88], [11.12, 12.23, 13.14]]) }
                </Col>
                <Col xs={1} style={{fontSize: '60px', textAlign: 'left'}}>]</Col>
              </Row>
            </Col>
          </Row>
        </CardText>
        <hr/>
        <CardText>
          <Row bottom="xs">
            <Col xs={4} style={{textAlign: 'center', fontSize: '22px'}}>
                Show me QAP<br/>conversion from R1CS for
            </Col>
            <Col xs={4}>
              <SelectField
                floatingLabelText="Vector">
                <MenuItem value={1} primaryText="A" />
                <MenuItem value={2} primaryText="B" />
                <MenuItem value={3} primaryText="C" />
              </SelectField>
            </Col>
            <Col xs={4}>
              <SelectField
                floatingLabelText="Variable">
                <MenuItem value={1} primaryText="out" />
                <MenuItem value={2} primaryText="sym_1" />
                <MenuItem value={3} primaryText="y" />
              </SelectField>
            </Col>
          </Row><br/><br/>
          <Row middle="xs" center="xs" style={{fontSize: '25px', fontFamily: 'monospace'}}>
            <Col xs={3}>
                QAP = lagrange
            </Col>
            <Col xs={1} style={{fontSize: '50px'}}>
                (
            </Col>
            <Col xs={7}>
                (1,5),(2,10),(3,5),(1,5),(2,10),(3,5),(1,5),(2,10),(3,5)
            </Col>
            <Col xs={1} style={{fontSize: '50px'}}>
                )
            </Col>
          </Row>
        </CardText>
        <hr/>
        <CardText>
          <Row center="xs">
            <Col xs={10}>
              <h2>QAP Visualization</h2>
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

export default R1CSToQAPCard
