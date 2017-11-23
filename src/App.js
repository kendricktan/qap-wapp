import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import logo from './assets/logo.svg';
import TextField from 'material-ui/TextField';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./styles/app.css"

// Prevents browser from selecting text
// When reorganizing mappings
const noSelectStyle = {
  webkitTouchCallout: 'none', /* iOS Safari */
  webkitUserSelect: 'none', /* Safari */
  khtmlUserSelect: 'none', /* Konqueror HTML */
  mozUserSelect: 'none', /* Firefox */
  msUserSelect: 'none', /* Internet Explorer/Edge */
  userSelect: 'none', /* Non-prefixed version, currently */
  padding: '5px 10px 5px 10px',
  cursor: 'pointer'
}

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const displayVector = (v) => {
  return v.reduce((acc, s) => acc + s + ' ', '[ ') + ']'
}

const displayEquation = (a, b) => {
  // Where a = b
  return (
    <Row center='xs' style={{ fontFamily: 'monospace' }}>
      <Col xs={4} style={{ textAlign: 'right' }}>{a}</Col>
      <Col xs={1} style={{ textAlign: 'center' }}>=</Col>
      <Col xs={4} style={{ textAlign: 'left' }}>{b}</Col>
    </Row>
  )
}

const vectorDisplayStyle = {
  textAlign: 'center',
  fontSize: '20px',
  fontFamily: 'monospace'
}

class FlattenCard extends Component {
  render() {
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


const SortableItem = SortableElement(({ value }) =>
  <span style={noSelectStyle}>{value}</span>
);

const SortableVector = SortableContainer(({ items }) => {
  return (
    <div>
      [&nbsp;{items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}&nbsp;]
    </div>
  );
});

class VariableMappingCard extends Component {
  state = {
    items: ['out', 'sym_1', 'y', 'sym_2', 'sym_3'],
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  render() {
    return (
      <Card>
        <CardTitle
          title="Variable Mapping"
          subtitle="The sequence of variable mapping defines the layout of vectors used in the R1CS.  (Drag and drop to reorganize and see changes propagate)"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          For more information, check out <a href="https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649">Vitalik's Post</a> under the section <strong>'Gates to R1CS'</strong>
        </CardText>
        <CardText style={vectorDisplayStyle}>
          <SortableVector items={this.state.items} onSortEnd={this.onSortEnd} axis='x' />
        </CardText>
      </Card>
    )
  }
}

class GatesToR1CSCard extends Component {
  render() {
    return (
      <Card>
        <CardTitle
          title="Gates to R1CS"
          subtitle="Each gate poses as a constraint to the R1CS that our solution needs to satisfy."
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          The R1CS is a group of 3 vectors <code>A, B, C</code>. And the solution to an R1CS vector is <code>S</code>, where <code>S</code> must satisfy the equation:
          <ul>
            <li><code>(S . A) * (S . B) - (S . C) = 0</code></li>
          </ul>
        </CardText>
        <CardText>
          <Row style={{ fontSize: '25px', textAlign: 'center' }}>
            <Col xs={6}>Vector</Col>
            <Col xs={6}>Expression</Col>
          </Row><br />
          <hr />
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={6}>
              A = {displayVector([0, 0, 0, 0, 1])}<br />
              B = {displayVector([0, 0, 0, 0, 1])}<br />
              C = {displayVector([0, 0, 0, 0, 1])}<br />
            </Col>
            <Col xs={6}>
              {displayEquation('x', '1')} <br />
              {displayEquation('sym_1', 'x + 1')}
            </Col>
          </Row>
          <hr />
          <Row middle="xs" style={vectorDisplayStyle}>
            <Col xs={6}>
              A = {displayVector([1, 0, 0, 0, 5])}<br />
              B = {displayVector([0, 0, 0, 0, 1])}<br />
              C = {displayVector([0, 0, 0, 0, 1])}<br />
            </Col>
            <Col xs={6}>
              {displayEquation('x', '2')} <br />
              {displayEquation('A1', '5 * sym_1')}
              {displayEquation('A', '1 + A1')}
              {displayEquation('sym_1', 'A * y')}
            </Col>
          </Row>
          <hr />
        </CardText>
        <CardText style={{ padding: '5px 50px 5px 50px' }}>
          <TextField
            floatingLabelText="Gate definition"
            hintText="y = 5 * sym_1; sym_2 = y + x"
            errorText=''
            fullWidth={true}
          />
          <FlatButton fullWidth={true} label="Add Gate" primary={true} />
        </CardText>
      </Card>
    )
  }
}

class R1CSToQAPCard extends Component {
  render() {
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
        </CardText>
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

class App extends Component {
  render() {
    return (
      <div>
        <AppBar
          showMenuIconButton={false}
          title="QAP Playground"
        />
        <div style={{ margin: '20px auto 20px auto', maxWidth: '1000px' }}>
          <FlattenCard /> <br />
          <VariableMappingCard /> <br />
          <GatesToR1CSCard /> <br />
          <R1CSToQAPCard /> <br />                  
        </div>
      </div>
    );
  }
}

export default App;